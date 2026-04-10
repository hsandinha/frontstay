import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/owner/documents
 * Retorna documentos visíveis ao proprietário logado.
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['proprietario', 'admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });
    }

    try {
        const userEmail = auth.user.email;

        // Busca unidades do proprietário para saber quais property_ids e unit_ids ele acessa
        const { data: ownerLinks, error: ownerError } = await supabase
            .from('unit_owners')
            .select('unit_id, property_units(id, unit_name, property_id)')
            .eq('owner_email', userEmail)
            .eq('active', true);

        if (ownerError) {
            console.error('Erro ao buscar unidades:', ownerError.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        if (!ownerLinks || ownerLinks.length === 0) {
            return NextResponse.json({ success: true, documents: [] });
        }

        const unitIds = ownerLinks.map((l: any) => l.unit_id).filter(Boolean);
        const propertyIds = [...new Set(ownerLinks.map((l: any) => (l.property_units as any)?.property_id).filter(Boolean))];

        // Unit name map
        const unitMap: Record<string, string> = {};
        for (const link of ownerLinks) {
            const unit = link.property_units as any;
            if (unit) unitMap[unit.id] = unit.unit_name;
        }

        // Busca documentos visíveis ao proprietário, dos seus prédios
        const { data: docs, error: docError } = await supabase
            .from('property_documents')
            .select('*')
            .in('property_id', propertyIds)
            .eq('visible_to_owner', true)
            .order('created_at', { ascending: false });

        if (docError) {
            console.error('Erro ao buscar documentos:', docError.message);
            return NextResponse.json({ error: 'Erro ao buscar documentos' }, { status: 500 });
        }

        // Filtra: documentos do prédio (unit_id null) ou da unidade do proprietário
        const filtered = (docs || []).filter((d: any) => !d.unit_id || unitIds.includes(d.unit_id));

        const enriched = filtered.map((d: any) => ({
            id: d.id,
            category: d.category,
            title: d.title,
            fileUrl: d.file_url,
            fileSizeBytes: d.file_size_bytes,
            mimeType: d.mime_type,
            unitId: d.unit_id,
            unitName: d.unit_id ? (unitMap[d.unit_id] || d.unit_id) : 'Prédio (geral)',
            createdAt: d.created_at,
        }));

        return NextResponse.json({ success: true, documents: enriched });
    } catch (err: any) {
        console.error('Erro inesperado em /api/owner/documents:', err.message);
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

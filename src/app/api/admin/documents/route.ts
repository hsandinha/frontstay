import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/require-auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/documents?propertyId=xxx
 * Lista documentos (admin pode ver todos).
 */
export async function GET(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const propertyId = request.nextUrl.searchParams.get('propertyId');

        let query = supabase
            .from('property_documents')
            .select('*, property_units(unit_name)')
            .order('created_at', { ascending: false });

        if (propertyId) query = query.eq('property_id', propertyId);

        const { data, error } = await query;
        if (error) {
            console.error('Erro ao buscar documentos:', error.message);
            return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
        }

        const documents = (data || []).map((d: any) => ({
            id: d.id,
            propertyId: d.property_id,
            unitId: d.unit_id,
            unitName: (d.property_units as any)?.unit_name || null,
            category: d.category,
            title: d.title,
            fileUrl: d.file_url,
            fileSizeBytes: d.file_size_bytes,
            mimeType: d.mime_type,
            visibleToOwner: d.visible_to_owner,
            createdAt: d.created_at,
        }));

        return NextResponse.json({ success: true, documents });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * POST /api/admin/documents
 * Cria registro de documento (URL do arquivo já uploadado externamente).
 */
export async function POST(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const body = await request.json();
        const { propertyId, unitId, category, title, fileUrl, fileSizeBytes, mimeType, visibleToOwner } = body;

        if (!propertyId || !category || !title || !fileUrl) {
            return NextResponse.json({ error: 'Campos obrigatórios: propertyId, category, title, fileUrl' }, { status: 400 });
        }

        const VALID_CATEGORIES = ['contract', 'condo_rules', 'meeting_minutes', 'maintenance_report', 'tax', 'personal', 'other'];
        if (!VALID_CATEGORIES.includes(category)) {
            return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
        }

        // Validate URL format
        try {
            new URL(String(fileUrl));
        } catch {
            return NextResponse.json({ error: 'URL do arquivo inválida' }, { status: 400 });
        }

        const { data: userData } = await supabase.from('users').select('id').eq('auth_user_id', auth.user.id).single();

        const { data, error } = await supabase
            .from('property_documents')
            .insert({
                property_id: String(propertyId),
                unit_id: unitId ? String(unitId) : null,
                category,
                title: String(title).slice(0, 300),
                file_url: String(fileUrl),
                file_size_bytes: fileSizeBytes ? Number(fileSizeBytes) : null,
                mime_type: mimeType ? String(mimeType).slice(0, 100) : null,
                uploaded_by: userData?.id || null,
                visible_to_owner: visibleToOwner !== false,
            })
            .select('id')
            .single();

        if (error) {
            console.error('Erro ao criar documento:', error.message);
            return NextResponse.json({ error: 'Erro ao criar documento' }, { status: 500 });
        }

        return NextResponse.json({ success: true, documentId: data.id }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/documents?id=xxx
 * Atualiza metadata de um documento.
 */
export async function PATCH(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const body = await request.json();
        const updates: Record<string, any> = {};

        if (body.title !== undefined) updates.title = String(body.title).slice(0, 300);
        if (body.category !== undefined) {
            const VALID = ['contract', 'condo_rules', 'meeting_minutes', 'maintenance_report', 'tax', 'personal', 'other'];
            if (!VALID.includes(body.category)) return NextResponse.json({ error: 'Categoria inválida' }, { status: 400 });
            updates.category = body.category;
        }
        if (body.visibleToOwner !== undefined) updates.visible_to_owner = Boolean(body.visibleToOwner);
        if (body.unitId !== undefined) updates.unit_id = body.unitId || null;

        const { error } = await supabase.from('property_documents').update(updates).eq('id', id);
        if (error) {
            console.error('Erro ao atualizar documento:', error.message);
            return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/documents?id=xxx
 * Remove documento.
 */
export async function DELETE(request: NextRequest) {
    const auth = await requireAuth(request, ['admin']);
    if (auth.error) return auth.error;

    const supabase = getSupabaseAdmin();
    if (!supabase) return NextResponse.json({ error: 'Supabase não configurado' }, { status: 500 });

    try {
        const id = request.nextUrl.searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID obrigatório' }, { status: 400 });

        const { error } = await supabase.from('property_documents').delete().eq('id', id);
        if (error) {
            console.error('Erro ao remover documento:', error.message);
            return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
    }
}

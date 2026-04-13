'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface ReservationData {
    id: string
    guestName: string
    firstName: string | null
    email: string | null
    roomName: string
    checkInDate: string | null
    checkOutDate: string | null
    nights: number
    status: string
    total: number | null
    balance: number | null
    paidAmount: number | null
    paymentStatus: 'paid' | 'partial' | 'pending' | 'unknown'
    source: string | null
    specialRequests: string | null
    propertyName: string | null
    propertyAddress: string | null
}

interface TimelineItem {
    label: string
    description: string
    date: string | null
    tone: string
}

export default function ReservaPage() {
    const params = useParams()
    const id = params?.id as string
    const [data, setData] = useState<{ reservation: ReservationData; timeline: TimelineItem[]; supportWhatsapp: string | null } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!id) return
        fetch(`/api/reserva/${id}`)
            .then(r => r.json())
            .then(d => {
                if (d.success) setData(d)
                else setError(d.error || 'Reserva não encontrada')
            })
            .catch(() => setError('Erro ao carregar reserva'))
            .finally(() => setLoading(false))
    }, [id])

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—'
        return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    }

    const formatCurrency = (val: number | null) => {
        if (val === null) return '—'
        return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    }

    const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
        confirmed: { label: 'Confirmada', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: '✅' },
        not_confirmed: { label: 'Pendente Pagamento', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: '⏳' },
        checked_in: { label: 'Hospedado', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: '🏨' },
        checked_out: { label: 'Finalizada', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', icon: '🏁' },
        canceled: { label: 'Cancelada', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: '❌' },
    }

    const paymentBadge: Record<string, { label: string; color: string }> = {
        paid: { label: 'Pago', color: 'bg-emerald-100 text-emerald-800' },
        partial: { label: 'Parcial', color: 'bg-amber-100 text-amber-800' },
        pending: { label: 'Pendente', color: 'bg-red-100 text-red-800' },
        unknown: { label: '—', color: 'bg-gray-100 text-gray-600' },
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-gray-500">Carregando reserva...</p>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center space-y-4">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl mx-auto">😕</div>
                    <h2 className="text-lg font-bold text-gray-900">Reserva não encontrada</h2>
                    <p className="text-sm text-gray-500">{error || 'Não foi possível localizar esta reserva.'}</p>
                    <Link href="/" className="inline-block px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition">
                        Voltar ao início
                    </Link>
                </div>
            </div>
        )
    }

    const r = data.reservation
    const s = statusConfig[r.status] || statusConfig.not_confirmed
    const pb = paymentBadge[r.paymentStatus]
    const whatsappNumber = data.supportWhatsapp?.replace(/\D/g, '') || ''
    const whatsappMessage = encodeURIComponent(
        `Olá! Gostaria de realizar o pagamento da reserva ${r.id}.\n\nNome: ${r.guestName}\nQuarto: ${r.roomName}\nCheck-in: ${formatDate(r.checkInDate)}\nCheck-out: ${formatDate(r.checkOutDate)}\nValor: ${formatCurrency(r.balance || r.total)}`
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <h1 className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">FrontStay</h1>
                </div>
            </header>

            <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
                {/* Status badge */}
                <div className={`${s.bg} border rounded-2xl p-4 flex items-center gap-3`}>
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                        <p className={`text-sm font-bold ${s.color}`}>{s.label}</p>
                        <p className="text-[11px] text-gray-500">Reserva {r.id}</p>
                    </div>
                </div>

                {/* Detalhes principais */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50">
                        <h2 className="text-base font-bold text-gray-900">📋 Detalhes da Reserva</h2>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Datas */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-blue-50/50 rounded-xl p-3.5 text-center">
                                <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider mb-1">Check-in</p>
                                <p className="text-sm font-bold text-gray-900">{formatDate(r.checkInDate)}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">a partir de 14h</p>
                            </div>
                            <div className="bg-indigo-50/50 rounded-xl p-3.5 text-center">
                                <p className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1">Check-out</p>
                                <p className="text-sm font-bold text-gray-900">{formatDate(r.checkOutDate)}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5">até 11h</p>
                            </div>
                        </div>

                        {/* Info cards */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-sm">🏨</div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Acomodação</p>
                                    <p className="text-sm font-semibold text-gray-900">{r.roomName} · {r.nights} {r.nights === 1 ? 'noite' : 'noites'}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm">👤</div>
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">Hóspede</p>
                                    <p className="text-sm font-semibold text-gray-900">{r.guestName}</p>
                                </div>
                            </div>

                            {r.propertyName && (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-sm">📍</div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Local</p>
                                        <p className="text-sm font-semibold text-gray-900">{r.propertyName}</p>
                                        {r.propertyAddress && <p className="text-[11px] text-gray-400">{r.propertyAddress}</p>}
                                    </div>
                                </div>
                            )}

                            {r.specialRequests && (
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-sm mt-0.5">💬</div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Observações</p>
                                        <p className="text-sm text-gray-700">{r.specialRequests}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pagamento */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900">💰 Pagamento</h2>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${pb.color}`}>{pb.label}</span>
                    </div>

                    <div className="p-5">
                        <div className="space-y-3">
                            {r.total !== null && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Total</span>
                                    <span className="text-sm font-bold text-gray-900">{formatCurrency(r.total)}</span>
                                </div>
                            )}
                            {r.paidAmount !== null && r.paidAmount > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Pago</span>
                                    <span className="text-sm font-semibold text-emerald-600">{formatCurrency(r.paidAmount)}</span>
                                </div>
                            )}
                            {r.balance !== null && r.balance > 0 && (
                                <>
                                    <div className="border-t border-dashed border-gray-200 my-2" />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-bold text-gray-900">Saldo restante</span>
                                        <span className="text-base font-bold text-red-600">{formatCurrency(r.balance)}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Botão Pagamento */}
                        {r.paymentStatus !== 'paid' && r.status !== 'canceled' && whatsappNumber && (
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                Realizar Pagamento via WhatsApp
                            </a>
                        )}

                        {r.paymentStatus === 'paid' && (
                            <div className="mt-5 text-center py-3.5 bg-emerald-50 rounded-xl">
                                <p className="text-sm font-bold text-emerald-700">✅ Pagamento confirmado!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Timeline */}
                {data.timeline.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-50">
                            <h2 className="text-base font-bold text-gray-900">📱 Histórico</h2>
                        </div>
                        <div className="p-5">
                            <div className="space-y-4">
                                {data.timeline.map((item, i) => {
                                    const toneConfig: Record<string, string> = {
                                        success: 'bg-emerald-100 border-emerald-300',
                                        warning: 'bg-amber-100 border-amber-300',
                                        info: 'bg-blue-100 border-blue-300',
                                        neutral: 'bg-gray-100 border-gray-300',
                                    }
                                    return (
                                        <div key={i} className="flex gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 border ${toneConfig[item.tone] || toneConfig.neutral}`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                                                <p className="text-xs text-gray-500">{item.description}</p>
                                                {item.date && (
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Suporte */}
                {whatsappNumber && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-center space-y-3">
                        <p className="text-white/90 text-sm">Dúvidas sobre sua reserva?</p>
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Tenho uma dúvida sobre minha reserva ${r.id}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-medium rounded-full transition-all"
                        >
                            📞 Falar com o Suporte
                        </a>
                    </div>
                )}

                {/* Footer */}
                <footer className="text-center py-6">
                    <p className="text-[11px] text-gray-300">
                        FrontStay — Gestão inteligente de hospedagem
                    </p>
                </footer>
            </main>
        </div>
    )
}

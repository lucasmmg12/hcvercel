import { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import {
    LayoutDashboard, AlertTriangle, Users, Activity,
    ShieldCheck, Clock, TrendingUp, Scissors, FileBarChart2
} from 'lucide-react';
import { obtenerDatosDashboard, DashboardStats } from '../services/dashboardService';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await obtenerDatosDashboard();
                setStats(data);
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4"></div>
                <p className="text-green-400 font-medium animate-pulse">Cargando métricas estratégicas...</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
            {/* Header Sección */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h2 className="text-4xl font-extrabold text-white flex items-center gap-3 tracking-tight">
                        <LayoutDashboard className="w-10 h-10 text-green-500" />
                        Panel de Control Estratégico
                    </h2>
                    <p className="text-gray-400 mt-2 text-lg font-light">
                        Análisis en tiempo real de la calidad médica y gestión del Sanatorio Argentino.
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                    <Activity className="w-5 h-5 text-green-500 animate-pulse" />
                    <span className="text-green-400 font-medium whitespace-nowrap">Sistema Activo</span>
                </div>
            </div>

            {/* Grid de KPIs Rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
                    title="Total Auditorías"
                    value={stats.auditoriasPorFecha.reduce((s, d) => s + d.cantidad, 0).toString()}
                    trend="+12% vs mes anterior"
                    color="green"
                />
                <KpiCard
                    icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
                    title="Total Errores Detectados"
                    value={stats.erroresPorEtapa.reduce((s, e) => s + e.cantidad, 0).toString()}
                    trend="En revisión constante"
                    color="red"
                />
                <KpiCard
                    icon={<Users className="w-8 h-8 text-blue-500" />}
                    title="Médicos Auditados"
                    value={stats.rankingMedicos.length.toString()}
                    trend="Cobertura total"
                    color="blue"
                />
                <KpiCard
                    icon={<Clock className="w-8 h-8 text-purple-500" />}
                    title="Días Analizados"
                    value={stats.auditoriasPorFecha.length.toString()}
                    trend="Ventana de tiempo actual"
                    color="purple"
                />
            </div>

            {/* Fila 1: Análisis de Errores */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Errores por Etapa */}
                <ChartContainer title="Distribución de Errores por Etapa" icon={<FileBarChart2 className="text-green-400" />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.erroresPorEtapa}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="etapa" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#22c55e' }}
                            />
                            <Bar dataKey="cantidad" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Severidad */}
                <ChartContainer title="Severidad de los Errores" icon={<AlertTriangle className="text-red-400" />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.erroresPorSeveridad}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="cantidad"
                                nameKey="severidad"
                            >
                                {stats.erroresPorSeveridad.map((_entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* Fila 2: Médicos y Roles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Ranking Médicos */}
                <ChartContainer title="Top 10 Médicos con más Observaciones" icon={<Users className="text-blue-400" />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.rankingMedicos} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                            <XAxis type="number" stroke="#999" fontSize={12} hide />
                            <YAxis dataKey="nombre" type="category" stroke="#999" fontSize={11} width={120} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#3b82f6' }}
                            />
                            <Bar dataKey="errores" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Errores por Rol */}
                <ChartContainer title="Distribución de Errores por Rol Médico" icon={<Activity className="text-purple-400" />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.erroresPorRol}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="rol" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#a855f7' }}
                            />
                            <Bar dataKey="cantidad" fill="#a855f7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* Fila 3: Volumen y Gestión */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Volumen en el tiempo */}
                <div className="lg:col-span-2">
                    <ChartContainer title="Volumen de Auditorías (Últimos 30 días)" icon={<TrendingUp className="text-green-400" />}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={stats.auditoriasPorFecha}>
                                <defs>
                                    <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="fecha" stroke="#999" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#22c55e' }}
                                />
                                <Area type="monotone" dataKey="cantidad" stroke="#22c55e" fillOpacity={1} fill="url(#colorQty)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>

                {/* Bisturí Armónico */}
                <ChartContainer title="Uso de Bisturí Armónico" icon={<Scissors className="text-orange-400" />}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.usoBisturi}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="cantidad"
                                nameKey="tipo"
                            >
                                {stats.usoBisturi.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.tipo === 'SI' ? '#22c55e' : entry.tipo === 'NO' ? '#ef4444' : '#94a3b8'} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>

            {/* Fila 4: Obra Social */}
            <ChartContainer title="Distribución por Obra Social" icon={<ShieldCheck className="text-cyan-400" />}>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={stats.distribucionObraSocial}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="nombre" stroke="#999" fontSize={11} interval={0} tickLine={false} axisLine={false} />
                        <YAxis stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#06b6d4' }}
                        />
                        <Bar dataKey="cantidad" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>

        </div>
    );
}

function KpiCard({ icon, title, value, trend, color }: {
    icon: React.ReactNode,
    title: string,
    value: string,
    trend: string,
    color: 'green' | 'red' | 'blue' | 'purple'
}) {
    const colorMap = {
        green: 'border-green-500/20 bg-green-500/5',
        red: 'border-red-500/20 bg-red-500/5',
        blue: 'border-blue-500/20 bg-blue-500/5',
        purple: 'border-purple-500/20 bg-purple-500/5'
    };

    return (
        <div className={`p-6 rounded-2xl border ${colorMap[color]} backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/[0.03]`}>
            <div className="flex items-start justify-between">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    {icon}
                </div>
                <div className="text-right">
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h4 className="text-3xl font-bold text-white mt-1">{value}</h4>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10`}>
                    {trend}
                </span>
            </div>
        </div>
    );
}

function ChartContainer({ children, title, icon }: { children: React.ReactNode, title: string, icon: React.ReactNode }) {
    return (
        <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col h-full bg-[#0a0a0a]/40 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                {icon}
                <h3 className="text-lg font-semibold text-white/90">{title}</h3>
            </div>
            <div className="flex-1 min-h-[300px]">
                {children}
            </div>
        </div>
    );
}

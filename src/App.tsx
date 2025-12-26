import { useState } from 'react';
import { FileText, Stethoscope, Menu, X, Instagram, Globe, MessageCircle, Linkedin, History } from 'lucide-react';
import { Documentacion } from './pages/Documentacion';
import { AuditarPDF } from './pages/AuditarPDF';
import { Historial } from './pages/Historial';
import { UpdatesHub } from './pages/UpdatesHub';

type Page = 'documentacion' | 'auditar' | 'historial' | 'actualizaciones';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('documentacion');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden">
      {/* Background Decorativo */}
      <div className="fixed inset-0 bg-tech-grid pointer-events-none z-0"></div>

      {/* Orbes de luz ambiental */}
      <div className="fixed top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-green-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <header className="glass-dark sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logogrow.png"
                alt="Grow Labs Logo"
                className="h-14 w-14 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">Auditoría Médica</h1>
                <p className="text-sm text-green-400 font-medium tracking-wider">Donde tus ideas crecen</p>
              </div>
            </div>

            <nav className="hidden md:flex gap-2">
              <button
                onClick={() => setCurrentPage('documentacion')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 'documentacion'
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documentación
                </span>
              </button>
              <button
                onClick={() => setCurrentPage('auditar')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 'auditar'
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Auditar PDF
                </span>
              </button>
              <button
                onClick={() => setCurrentPage('historial')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 'historial'
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historial
                </span>
              </button>
              <button
                onClick={() => setCurrentPage('actualizaciones')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 'actualizaciones'
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Actualizaciones
                </span>
              </button>
            </nav>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 flex flex-col gap-2 pb-2 border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  setCurrentPage('documentacion');
                  setMobileMenuOpen(false);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all text-left ${currentPage === 'documentacion'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documentación
                </span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage('auditar');
                  setMobileMenuOpen(false);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all text-left ${currentPage === 'auditar'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Auditar PDF
                </span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage('historial');
                  setMobileMenuOpen(false);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all text-left ${currentPage === 'historial'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historial
                </span>
              </button>
              <button
                onClick={() => {
                  setCurrentPage('actualizaciones');
                  setMobileMenuOpen(false);
                }}
                className={`px-6 py-3 rounded-lg font-semibold transition-all text-left ${currentPage === 'actualizaciones'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Actualizaciones
                </span>
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="pb-12 relative z-10">
        {currentPage === 'documentacion' && <Documentacion />}
        {currentPage === 'auditar' && <AuditarPDF />}
        {currentPage === 'historial' && <Historial />}
        {currentPage === 'actualizaciones' && <UpdatesHub />}
      </main>

      <footer className="glass-dark border-t border-white/10 text-white py-12 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logogrow.png"
                  alt="Grow Labs Logo"
                  className="h-12 w-12 object-contain p-1"
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">Grow Labs</h3>
                  <p className="text-green-400 text-sm font-medium">Donde tus ideas crecen</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed font-light">
                Startup tecnológica especializada en inteligencia artificial y automatización de procesos.
                Transformamos ideas en soluciones innovadoras.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/growsanjuan/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105"
                >
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-medium">Instagram</span>
                </a>
                <a
                  href="https://api.whatsapp.com/send/?phone=5492643229503&text&type=phone_number&app_absent=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-green-500/30 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>
              <div className="flex gap-4 mt-3">
                <a
                  href="https://growlabs.click/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-blue-500/30 hover:scale-105"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">Sitio Web</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/lucas-marinero-182521308/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#0077b5] hover:bg-[#006396] text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-blue-500/30 hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-green-500/20">
              <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-green-400" />
                Cliente Exclusivo
              </h4>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">
                  Esta plataforma ha sido desarrollada única y exclusivamente para:
                </p>
                <p className="text-2xl font-bold text-green-400 text-glow">
                  Sanatorio Argentino
                </p>
                <p className="text-gray-500 text-sm">
                  San Juan, Argentina
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500">
                    Sistema de auditoría médica con tecnología de IA para optimización de procesos clínicos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 Grow Labs. Todos los derechos reservados. | Powered by AI & Automation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

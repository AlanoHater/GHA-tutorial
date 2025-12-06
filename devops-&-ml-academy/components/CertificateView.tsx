import React from 'react';
import { Certificate } from '../types';
import { Award, Download, Share2, Trophy, Calendar, Star } from './Icons';

interface CertificateViewProps {
  certificates: Certificate[];
  onDownload?: (certificate: Certificate) => void;
  onShare?: (certificate: Certificate) => void;
}

const CertificateView: React.FC<CertificateViewProps> = ({ certificates, onDownload, onShare }) => {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay certificados aún</h3>
        <p className="text-gray-500">Completa capítulos para obtener certificados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tus Certificados</h2>
        <p className="text-gray-600">Logros obtenidos en tu viaje de aprendizaje</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Certificate Header */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">{cert.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{cert.title}</h3>
              <p className="text-sm text-gray-600">{cert.description}</p>
            </div>

            {/* Certificate Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Obtenido: {cert.earnedDate.toLocaleDateString('es-ES')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold">
                <Star className="w-4 h-4" />
                <span>{cert.xpRequired} XP requeridos</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {onDownload && (
                <button
                  onClick={() => onDownload(cert)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
              )}
              {onShare && (
                <button
                  onClick={() => onShare(cert)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-8 h-8 text-green-600" />
          <h3 className="text-xl font-bold text-green-900">Resumen de Logros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{certificates.length}</div>
            <div className="text-sm text-green-700">Certificados obtenidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {certificates.reduce((total, cert) => total + cert.xpRequired, 0)}
            </div>
            <div className="text-sm text-green-700">XP total ganado</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {certificates.length > 0 ? '🏆' : '📚'}
            </div>
            <div className="text-sm text-green-700">
              {certificates.length > 0 ? '¡Felicitaciones!' : 'Sigue aprendiendo'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;

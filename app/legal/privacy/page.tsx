import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/register">
          <Button variant="ghost" size="sm">
            ← Volver al registro
          </Button>
        </Link>
      </div>

      <Card className="p-6 sm:p-8">
        <h1 className="mb-6 text-3xl font-bold">Política de Privacidad y Cookies</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Información que Recopilamos</h2>
            <p className="mb-2">
              En Ecomama recopilamos la siguiente información:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Información de registro:</strong> nombre, correo electrónico y contraseña</li>
              <li><strong>Información de perfil:</strong> biografía, ubicación, teléfono y foto de perfil (opcional)</li>
              <li><strong>Contenido publicado:</strong> anuncios, eventos y comentarios que publiques</li>
              <li><strong>Datos de ubicación:</strong> coordenadas geográficas de anuncios y eventos</li>
              <li><strong>Datos de uso:</strong> información sobre cómo utilizas la plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. Cómo Utilizamos tu Información</h2>
            <p className="mb-2">
              Utilizamos tus datos personales para:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Proporcionar y mejorar nuestros servicios</li>
              <li>Facilitar el intercambio entre miembros de la comunidad</li>
              <li>Mostrar anuncios y eventos en el mapa según su ubicación</li>
              <li>Enviar notificaciones sobre eventos y actividades</li>
              <li>Mantener la seguridad de la plataforma</li>
              <li>Cumplir con obligaciones legales</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Base Legal del Tratamiento</h2>
            <p className="mb-2">
              El tratamiento de tus datos se basa en:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Consentimiento:</strong> al aceptar esta política de privacidad</li>
              <li><strong>Ejecución del contrato:</strong> para proporcionar los servicios solicitados</li>
              <li><strong>Interés legítimo:</strong> para mejorar la plataforma y prevenir fraudes</li>
              <li><strong>Obligación legal:</strong> cuando la ley lo requiera</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Compartir Información</h2>
            <p>
              No vendemos ni alquilamos tu información personal. Solo compartimos datos con:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Otros usuarios:</strong> información de perfil público, anuncios y eventos</li>
              <li><strong>Proveedores de servicios:</strong> empresas que nos ayudan a operar la plataforma</li>
              <li><strong>Autoridades:</strong> cuando sea requerido por ley</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Tus Derechos (RGPD)</h2>
            <p className="mb-2">
              Conforme al Reglamento General de Protección de Datos (RGPD), tienes derecho a:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Acceso:</strong> solicitar una copia de tus datos personales</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
              <li><strong>Supresión:</strong> eliminar tus datos personales</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos</li>
              <li><strong>Limitación:</strong> solicitar la limitación del tratamiento</li>
            </ul>
            <p className="mt-2">
              Para ejercer estos derechos, contacta con nosotros a través de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Seguridad de los Datos</h2>
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos 
              contra acceso no autorizado, pérdida o alteración. Sin embargo, ningún sistema es 
              completamente seguro.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Retención de Datos</h2>
            <p>
              Conservamos tus datos personales mientras mantengas tu cuenta activa o según sea 
              necesario para cumplir con obligaciones legales. Puedes solicitar la eliminación 
              de tu cuenta en cualquier momento.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Cookies y Tecnologías Similares</h2>
            <p className="mb-2">
              Utilizamos cookies y tecnologías similares para:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento de la plataforma (sesión de usuario)</li>
              <li><strong>Cookies de rendimiento:</strong> nos ayudan a mejorar la experiencia del usuario</li>
              <li><strong>Cookies funcionales:</strong> recuerdan tus preferencias</li>
            </ul>
            <p className="mt-2">
              Puedes gestionar las cookies desde la configuración de tu navegador, aunque esto 
              puede afectar la funcionalidad de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">9. Transferencias Internacionales</h2>
            <p>
              Tus datos pueden ser transferidos y procesados en servidores ubicados fuera del 
              Espacio Económico Europeo. Nos aseguramos de que estas transferencias cumplan con 
              el RGPD mediante cláusulas contractuales estándar.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">10. Menores de Edad</h2>
            <p>
              Ecomama no está dirigida a menores de 16 años. No recopilamos intencionalmente 
              información de menores. Si eres padre o tutor y crees que tu hijo nos ha proporcionado 
              información personal, contacta con nosotros.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">11. Cambios en esta Política</h2>
            <p>
              Podemos actualizar esta política periódicamente. Te notificaremos cualquier cambio 
              significativo mediante un aviso en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">12. Contacto y Autoridad de Control</h2>
            <p>
              Para cualquier consulta sobre esta política de privacidad, puedes contactarnos a 
              través de la plataforma. También tienes derecho a presentar una reclamación ante la 
              autoridad de protección de datos de tu país.
            </p>
          </section>

          <p className="mt-8 text-xs">
            Última actualización: 19 de noviembre de 2025
          </p>
        </div>
      </Card>
    </div>
  );
}

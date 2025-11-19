import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TermsPage() {
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
        <h1 className="mb-6 text-3xl font-bold">Términos y Condiciones</h1>
        
        <div className="space-y-6 text-sm text-muted-foreground">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar Ecomama, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">2. Uso de la Plataforma</h2>
            <p className="mb-2">
              Ecomama es una plataforma de economía colaborativa y sostenible. Los usuarios se comprometen a:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Proporcionar información veraz y actualizada</li>
              <li>No realizar actividades ilegales o fraudulentas</li>
              <li>Respetar a otros miembros de la comunidad</li>
              <li>No publicar contenido ofensivo, discriminatorio o inapropiado</li>
              <li>Cumplir con las leyes aplicables en su jurisdicción</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">3. Contenido del Usuario</h2>
            <p>
              Los usuarios son responsables del contenido que publican en la plataforma. 
              Ecomama se reserva el derecho de eliminar cualquier contenido que viole estos términos 
              o que sea reportado como inapropiado por otros usuarios.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">4. Intercambios y Transacciones</h2>
            <p>
              Ecomama facilita el contacto entre usuarios, pero no es responsable de las transacciones 
              realizadas entre ellos. Los usuarios son responsables de verificar la calidad de los 
              productos o servicios intercambiados.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">5. Privacidad y Protección de Datos</h2>
            <p>
              El tratamiento de tus datos personales se rige por nuestra Política de Privacidad. 
              Al utilizar Ecomama, aceptas la recopilación y uso de información según lo descrito 
              en dicha política.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">6. Propiedad Intelectual</h2>
            <p>
              Todos los derechos de propiedad intelectual de la plataforma Ecomama pertenecen a sus creadores. 
              Los usuarios conservan los derechos sobre el contenido que publican.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">7. Modificaciones</h2>
            <p>
              Ecomama se reserva el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">8. Terminación</h2>
            <p>
              Ecomama puede suspender o terminar el acceso de un usuario a la plataforma en caso de 
              violación de estos términos, sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">9. Limitación de Responsabilidad</h2>
            <p>
              Ecomama no será responsable de daños directos, indirectos, incidentales o consecuentes 
              derivados del uso o la imposibilidad de uso de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-foreground">10. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos, puedes contactarnos a través de la plataforma.
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

import { CheckCircle2, Download, ShieldCheck, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";

const apkUrl = "/downloads/sos-venezuela.apk";
const apkSha256 = "8E116445778E22352B9969237155F26EEF74D7AB6D25DB4B054017343F5D9D80";

export default function DownloadPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-5">
      <section className="grid gap-4 py-4 sm:py-6">
        <p className="text-xs font-bold uppercase tracking-widest text-rescue-500 sm:text-sm">App Android</p>
        <h1 className="max-w-3xl text-3xl font-black leading-tight sm:text-5xl">Descarga oficial de SOS Venezuela.</h1>
        <p className="max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
          Esta APK abre la plataforma oficial de ayuda humanitaria. Android puede avisar que viene de una fuente externa porque aun no esta publicada en Play Store.
        </p>
        <a
          href={apkUrl}
          download
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-rescue-500 px-5 py-3 text-sm font-black text-black transition hover:bg-rescue-600 sm:w-fit"
        >
          <Download className="h-5 w-5" />
          Descargar APK
        </a>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 sm:p-5">
          <Smartphone className="h-6 w-6 text-rescue-500" />
          <h2 className="mt-3 font-black">Instalacion</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Descarga el archivo, abre la notificacion y permite instalar desde el navegador solo si Android lo solicita.
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <ShieldCheck className="h-6 w-6 text-rescue-500" />
          <h2 className="mt-3 font-black">Permisos</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Esta version solo requiere internet. No pide contactos, SMS, llamadas ni acceso a archivos personales.
          </p>
        </Card>
        <Card className="p-4 sm:p-5">
          <CheckCircle2 className="h-6 w-6 text-rescue-500" />
          <h2 className="mt-3 font-black">Version</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            APK de prueba interna. Cuando se publique una release final, se reemplazara este archivo por una APK firmada de produccion.
          </p>
        </Card>
      </section>

      <Card className="p-4 sm:p-5">
        <h2 className="font-black">Verificacion del archivo</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Si quieres comprobar que el archivo no fue cambiado, compara esta huella SHA-256 despues de descargarlo:
        </p>
        <code className="mt-3 block break-all rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-zinc-200">
          {apkSha256}
        </code>
      </Card>
    </div>
  );
}

import Image from "next/image";

const ILLUSTRATION_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBqjSveLwxggL9VfuS_AtD1LPWohnNc8DRqDK_hPGEqV3EkjonpDubAlOVScgMPDZp1_hXuWOXxKVAfO3fq7ptxxKaAfvKBhvK0l0xEwO8_pMHZhlC982y7O4cs5wHkzR7vMFnzTTc8E_wRu62fxeMiFAN9eU3FiFRr2ozKSVGbj3cKaWVunS9gQOh800PBevRnSep4ItDbRKqXX6MlNtEt9FLymPdgVI098lojHc79lJ9g7RieyYKix5lGo_Q98kc9YsWFAVjXt44";

const features = [
  { icon: "group", label: "Manage workforce" },
  { icon: "verified_user", label: "Track Visas" },
  { icon: "fact_check", label: "Monitor Compliance" },
];
const LOGO = "/icons/Munazzam-Logo.jpg";

export function LoginBrandingAside() {
  return (
    <aside className="relative hidden h-screen shrink-0 flex-col justify-between overflow-hidden bg-primary p-xl md:flex md:w-1/2 lg:w-3/5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.18),transparent_50%)]" />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        <div className="mb-xl shrink-0 flex ">
          <Image
            src={LOGO}
            alt="Munazzam Logo"
            width={120}
            height={120}
            className="object-contain"
            style={{ width: "auto", height: "3.5rem" , borderRadius: "11px"}}
            priority
          />
          
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-end">
          <div className="max-w-xl">
            <h1 className="mb-lg text-balance text-headline-lg leading-tight text-white lg:text-display-lg">
              Powering Qatar&apos;s{" "}
              <span className="text-secondary-fixed">Enterprise Excellence.</span>
            </h1>

            <div className="space-y-md">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-md text-white/90"
                >
                  <div className="shrink-0 rounded-lg bg-white/10 p-2 backdrop-blur-md">
                    <span className="material-symbols-outlined text-secondary-fixed">
                      {feature.icon}
                    </span>
                  </div>
                  <span className="text-headline-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

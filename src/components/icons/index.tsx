import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  CircleHelp,
  Cloud,
  Code,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Ellipsis,
  ExternalLink,
  FlaskConical,
  Home,
  Info,
  KeyRound,
  Link2,
  Lock,
  LogOut,
  MessageCircle,
  MessageSquareText,
  Minus,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  SlidersHorizontal,
  SquarePen,
  Sun,
  Table2,
  Trash2,
  TriangleAlert,
  User,
  X,
  type LucideProps,
} from "lucide-react";

/**
 * Semantic icon set. Every icon renders `data-component="Icon"` +
 * `data-icon="<name>"` so tooling can find glyphs by meaning, and pages
 * never import lucide directly (ESLint-enforced).
 */
type IconProps = Omit<LucideProps, "ref"> & { size?: number };

function make(name: string, Glyph: React.ComponentType<LucideProps>) {
  const Icon = ({ size = 16, strokeWidth = 1.75, ...props }: IconProps) => (
    <Glyph
      data-component="Icon"
      data-icon={name}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
  Icon.displayName = `${name}Icon`;
  return Icon;
}

export const HomeIcon = make("home", Home);
export const WorkbenchIcon = make("workbench", FlaskConical);
export const CloudIcon = make("cloud", Cloud);
export const BareMetalIcon = make("bare-metal", SquarePen);
export const DocsIcon = make("docs", BookOpen);
export const SupportIcon = make("support", CircleHelp);
export const FeedbackIcon = make("feedback", MessageSquareText);
export const BellIcon = make("bell", Bell);
export const SearchIcon = make("search", Search);
export const SelectorIcon = make("selector", ChevronsUpDown);
export const ChevronDownIcon = make("chevron-down", ChevronDown);
export const ChevronUpIcon = make("chevron-up", ChevronUp);
export const ChevronLeftIcon = make("chevron-left", ChevronLeft);
export const ChevronRightIcon = make("chevron-right", ChevronRight);
export const ArrowRightIcon = make("arrow-right", ArrowRight);
export const ArrowLeftIcon = make("arrow-left", ArrowLeft);
export const ArrowUpRightIcon = make("arrow-up-right", ArrowUpRight);
export const AddIcon = make("add", Plus);
export const CloseIcon = make("close", X);
export const CopyIcon = make("copy", Copy);
export const CheckIcon = make("check", Check);
export const InfoIcon = make("info", Info);
export const LockIcon = make("lock", Lock);
export const SettingsIcon = make("settings", Settings);
export const DollarIcon = make("dollar", DollarSign);
export const TokenIcon = make("token", KeyRound);
export const ThemeIcon = make("theme", Monitor);
export const SunIcon = make("sun", Sun);
export const MoonIcon = make("moon", Moon);
export const SignOutIcon = make("sign-out", LogOut);
export const ResetIcon = make("reset", RefreshCw);
export const CompareIcon = make("compare", ArrowLeftRight);
export const CodeIcon = make("code", Code);
export const ParametersIcon = make("parameters", SlidersHorizontal);
export const MoreIcon = make("more", Ellipsis);
export const TableIcon = make("table", Table2);
export const PresetIcon = make("preset", MessageCircle);
export const ExternalLinkIcon = make("external-link", ExternalLink);
export const DeleteIcon = make("delete", Trash2);
export const MinusIcon = make("minus", Minus);
export const CardIcon = make("card", CreditCard);
export const DownloadIcon = make("download", Download);
export const UserIcon = make("user", User);
export const WarningIcon = make("warning", TriangleAlert);
export const CollapseNavIcon = make("collapse-nav", PanelLeftClose);
export const ExpandNavIcon = make("expand-nav", PanelLeftOpen);
export const LinkIcon = make("link", Link2);
export const SaveIcon = make("save", Save);

/* ── Product marks ─────────────────────────────────────────────────── */

const MARK_PATHS = [
  "M52.2192 3.25348C52.2192 0.41603 48.7904 -1.00838 46.7786 0.993333L19.1909 28.4424C18.7968 28.8345 19.0746 29.507 19.6306 29.507H23.6172C23.8062 29.507 23.995 29.4927 24.1818 29.4642L30.333 28.525C34.2271 27.9304 38.1908 27.9546 42.0773 28.5967L47.2829 29.4567C47.4845 29.49 47.6884 29.5068 47.8927 29.5068H50.6953C51.5369 29.5068 52.2192 28.8247 52.2192 27.9834V3.25348Z",
  "M9.57772 29.4978C9.02266 29.4978 8.74446 28.8271 9.13667 28.4345L28.2127 9.33811C29.328 8.22161 31.1379 8.22095 32.254 9.33665C33.3695 10.4518 33.3695 12.2597 32.254 13.3748L16.9902 28.6327C16.4361 29.1865 15.6847 29.4977 14.9011 29.4977L9.57772 29.4978Z",
  "M1.4802 29.5015C0.164841 29.5015 -0.494583 27.9124 0.434584 26.9817L12.027 15.3707C13.142 14.2538 14.952 14.2529 16.0682 15.3687C17.1836 16.4836 17.1836 18.2914 16.0682 19.4063L6.83451 28.6364C6.28046 29.1903 5.52901 29.5014 4.74546 29.5014L1.4802 29.5015Z",
];

/* N S C A L E — the wordmark glyphs, same geometry as the mark. */
const WORD_PATHS = [
  "M66.6339 29.491V2.94871C66.6339 1.32828 67.9627 0 69.5838 0C70.3943 0 71.1347 0.331097 71.6841 0.884224L90.2328 19.4257V0H96.1325V26.5423C96.1325 28.1627 94.8037 29.491 93.1826 29.491C92.3721 29.491 91.6317 29.1599 91.0823 28.6068L72.5336 10.0654V29.4949H66.6339V29.491Z",
  "M129.508 5.89743H105.906V11.7949H123.609C126.855 11.7949 129.508 14.4475 129.508 17.6923V23.5897C129.508 26.8345 126.855 29.4871 123.609 29.4871H100.006V23.5897H123.609V17.6923H105.906C102.66 17.6923 100.006 15.0396 100.006 11.7949V5.89743C100.006 2.65267 102.66 0 105.906 0H129.508V5.89743Z",
  "M139.281 29.491C136.035 29.491 133.382 26.8383 133.382 23.5936V5.89743C133.382 2.65267 136.035 0 139.281 0H162.884V5.89743H139.281V23.5936H162.884V29.491H139.281Z",
  "M190.356 0C193.602 0 196.256 2.65267 196.256 5.89743V29.491H190.356V17.6923H172.653V29.491H166.754V5.89743C166.754 2.65267 169.407 0 172.653 0H190.356ZM172.653 11.7987H190.356V5.90132H172.653V11.7987Z",
  "M206.025 29.491C202.779 29.491 200.126 26.8383 200.126 23.5936V0H206.025V23.5936H229.628V29.491H206.025Z",
  "M263 5.89743H239.397V11.7949H263V17.6923H239.397V23.5897H263V29.4871H239.397C236.151 29.4871 233.497 26.8345 233.497 23.5897V5.89743C233.497 2.65267 236.151 0 239.397 0H263V5.89743Z",
];

/** NscaleLogo — the full wordmark. Inherits `currentColor`. */
export function NscaleLogo({
  height = 14,
  className,
}: {
  height?: number;
  className?: string;
}) {
  const width = Math.round((263 / 30) * height);
  return (
    <svg
      data-component="NscaleLogo"
      width={width}
      height={height}
      viewBox="0 0 263 30"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="Nscale"
    >
      {[...MARK_PATHS, ...WORD_PATHS].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/** NscaleMark — the chevron mark alone (collapsed navigation, favicons). */
export function NscaleMark({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-component="NscaleMark"
      width={size}
      height={Math.round((30 / 53) * size)}
      viewBox="0 0 53 30"
      fill="currentColor"
      className={className}
      role="img"
      aria-label="Nscale"
    >
      {MARK_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* ── Service glyphs (bold, filled — the console's resource tiles) ──── */

export function CloudGlyph({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-component="CloudGlyph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 19.5a4.5 4.5 0 0 1-.6-8.96A6.5 6.5 0 0 1 18.9 9.6 4.5 4.5 0 0 1 17.5 19.5H7Z" />
    </svg>
  );
}

export function GpuGlyph({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-component="GpuGlyph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 3h9.5l-7 7H4V3Z" />
      <path d="M20 21h-9.5l7-7H20v7Z" />
      <path d="M4 21v-5.5L16.5 3H20v3.5L8 19.5V21H4Z" />
    </svg>
  );
}

export function KubernetesGlyph({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-component="KubernetesGlyph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5 20.5 6.8l2 9.2-6 7.5H7.5l-6-7.5 2-9.2L12 2.5Z" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 5.6v3.8M12 14.6v3.8M6 9.5l3.6 1.6M18 9.5l-3.6 1.6M7.2 17l2.6-2.9M16.8 17l-2.6-2.9" />
    </svg>
  );
}

export function SlurmGlyph({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-component="SlurmGlyph"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 3h3l11 9-11 9H5V3Z" />
    </svg>
  );
}

/* ── Illustrations ─────────────────────────────────────────────────── */

/** Big soft cloud used by the Serverless hero and the Get started tile. */
export function CloudIllustration({
  size = 64,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      data-component="CloudIllustration"
      width={size}
      height={Math.round(size * 0.72)}
      viewBox="0 0 100 72"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M26 70C12.5 70 2 60 2 47.5 2 36 10.5 26.5 21.5 25c3-13.5 15-23 29-23 15 0 27.5 11 29.5 25.5C92 29.5 100 38.5 100 49.5 100 61 90.5 70 79 70H26Z" />
    </svg>
  );
}

/**
 * Server rack scene for the GPU clusters banner: three cabinets, LED
 * rows, a floor glow. Fixed hex only — it sits on the dark banner.
 */
export function RackIllustration({ className }: { className?: string }) {
  const leds = Array.from({ length: 11 }, (_, i) => 66 + i * 22);
  return (
    <svg
      data-component="RackIllustration"
      viewBox="0 0 420 320"
      className={className}
      role="img"
      aria-label="Server racks"
    >
      <ellipse cx="210" cy="306" rx="190" ry="14" fill="#1f1f24" />
      {[
        { x: 38, w: 108, shade: "#141418", edge: "#2a2a31" },
        { x: 156, w: 108, shade: "#18181d", edge: "#33333b" },
        { x: 274, w: 108, shade: "#141418", edge: "#2a2a31" },
      ].map((rack, r) => (
        <g key={r}>
          <rect
            x={rack.x}
            y="36"
            width={rack.w}
            height="262"
            rx="6"
            fill={rack.shade}
            stroke={rack.edge}
          />
          <rect
            x={rack.x + 10}
            y="48"
            width={rack.w - 20}
            height="240"
            rx="3"
            fill="#0d0d10"
          />
          {leds.map((y, i) => (
            <g key={i}>
              <rect
                x={rack.x + 16}
                y={y}
                width={rack.w - 32}
                height="14"
                rx="2"
                fill={i % 3 === 1 ? "#1b1b21" : "#17171c"}
              />
              <rect
                x={rack.x + 20}
                y={y + 5}
                width="4"
                height="4"
                rx="1"
                fill={(i + r) % 4 === 0 ? "#a855f7" : "#3f3f46"}
              />
              <rect
                x={rack.x + 27}
                y={y + 5}
                width="4"
                height="4"
                rx="1"
                fill={(i + r) % 5 === 0 ? "#22c55e" : "#3f3f46"}
              />
              <rect
                x={rack.x + 40}
                y={y + 6}
                width={rack.w - 62}
                height="2"
                rx="1"
                fill="#26262c"
              />
            </g>
          ))}
        </g>
      ))}
      <rect x="20" y="296" width="380" height="4" rx="2" fill="#2d1a3a" />
    </svg>
  );
}

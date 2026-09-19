export default function SafetyBanner() {
  return (
    <div className="bg-amber-950/40 border border-amber-950/80 rounded-2xl p-4 mb-6 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
      <span className="text-xl">🛡️</span>
      <div>
        <h4 className="font-bold text-amber-400 mb-1">Safe Trading Guidelines</h4>
        <p className="text-amber-300/80 leading-relaxed">
          Bold.ng connects you directly with sellers. Always meet in a safe, public place (like a bank premises or shopping mall) to inspect items before making any payment. Never send upfront deposits for delivery!
        </p>
      </div>
    </div>
  );
}
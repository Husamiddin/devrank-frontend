export default function ChallengeCard({ challenge }) {
  // Backend'dan keladigan completed yoki status qiymatini tekshiramiz
  const isCompleted = challenge.completed || challenge.status === 'COMPLETED';
  const isLocked = challenge.locked || challenge.status === 'LOCKED';

  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      isCompleted 
        ? 'bg-green-950/20 border-green-500/40 shadow-lg shadow-green-950/10' // Bajarilgan bo'lsa yashirim fon va yashil chegara
        : isLocked 
        ? 'bg-red-950/10 border-red-500/20 opacity-70' 
        : 'bg-gray-900 border-gray-800 hover:border-gray-700'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
          {challenge.type}
        </span>
        <span className="text-yellow-400 font-bold text-sm">{challenge.points} pts</span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2">{challenge.title}</h3>
      <p className="text-gray-400 text-sm mb-6 line-clamp-2">{challenge.description}</p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <span className="text-xs text-gray-500 capitalize">
          {challenge.difficulty} • {challenge.category}
        </span>

        {/* Holatga qarab tugma yoki yozuv chiqishi */}
        {isCompleted ? (
          <span className="text-green-400 font-semibold flex items-center gap-1.5 text-sm">
            Bajarildi ✓
          </span>
        ) : isLocked ? (
          <span className="text-red-400 font-semibold text-sm flex items-center gap-1">
            Bloklandi ✕
          </span>
        ) : (
          <a href={`/challenge/${challenge.id}`} className="text-blue-400 hover:text-blue-300 font-medium text-sm flex items-center gap-1">
            Ochish &rarr;
          </a>
        )}
      </div>
    </div>
  );
}
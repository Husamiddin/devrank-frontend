import { useEffect } from 'react';

export default function QuizComponent({ challenge }) {
  
  // ANTI-COPY tizimi
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault(); // O'ng tugmani yopadi
    const handleKeyDown = (e) => {
      // Ctrl+C, Ctrl+V larni bloklaydi
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault();
        alert("Kechirasiz, platformada ko'chirish taqiqlangan!");
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    // "user-select: none" - matnni belgilashni (highlight) o'chiradi
    <div style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Quiz savollari shu yerda */}
    </div>
  );
}
import { useState } from 'react';
import { useAdmin } from '../AdminContext';
import { formatDate } from '../../lib/format';
import { IcChat } from '../../components/Icons';

export function AdminQuestions() {
  const { questions, answerQuestion } = useAdmin();
  const open = questions.filter((q) => q.status === 'open');
  const answered = questions.filter((q) => q.status === 'answered');

  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 font-display text-base font-bold text-ink dark:text-d-ink">
          Ochiq savollar {open.length > 0 && <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-xs text-white">{open.length}</span>}
        </h3>
        {open.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">{open.map((q) => <QuestionCard key={q.id} q={q} onAnswer={answerQuestion} />)}</div>
        )}
      </section>

      {answered.length > 0 && (
        <section>
          <h3 className="mb-2 font-display text-base font-bold text-ink dark:text-d-ink">Javob berilgan</h3>
          <div className="space-y-3">
            {answered.map((q) => (
              <div key={q.id} className="card p-4 opacity-80">
                <div className="text-xs text-muted dark:text-d-muted">{q.user_name} · {formatDate(q.created_at)}</div>
                <div className="mt-1 text-sm font-medium text-ink dark:text-d-ink">{q.question}</div>
                <div className="mt-2 rounded-btn bg-primary-tint px-3 py-2 text-sm text-primary dark:bg-primary/10">{q.answer}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function QuestionCard({ q, onAnswer }: { q: { id: number; user_name: string; question: string; created_at: string }; onAnswer: (id: number, a: string) => void }) {
  const [answer, setAnswer] = useState('');
  return (
    <div className="card p-4">
      <div className="text-xs text-muted dark:text-d-muted">{q.user_name} · {formatDate(q.created_at)}</div>
      <div className="mt-1 text-sm font-medium text-ink dark:text-d-ink">{q.question}</div>
      <div className="mt-3 flex gap-2">
        <input
          className="input flex-1"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Javob yozing…"
        />
        <button
          onClick={() => answer.trim() && onAnswer(q.id, answer.trim())}
          disabled={!answer.trim()}
          className={`btn-primary py-2.5 text-sm ${!answer.trim() ? 'opacity-50' : ''}`}
        >
          Yuborish
        </button>
      </div>
      <p className="mt-2 text-[11px] text-muted dark:text-d-muted">Javob botda mijozga yetkaziladi.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card flex flex-col items-center gap-2 py-10 text-muted dark:text-d-muted">
      <IcChat width={30} height={30} />
      <p className="text-sm">Ochiq savollar yo‘q</p>
    </div>
  );
}

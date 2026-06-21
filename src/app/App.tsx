import { useState, useEffect } from "react";
import { Search, Clock, ChefHat, Heart, Plus, ArrowLeft, Trash2, Edit3, X, Check, BookOpen } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Difficulty = "Fácil" | "Médio" | "Difícil";
type Category = "Todos" | "Café da manhã" | "Almoço" | "Jantar" | "Sobremesa" | "Lanches";

interface Recipe {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  prepTime: number;
  difficulty: Difficulty;
  ingredients: string;
  instructions: string;
  favorite: boolean;
  emoji: string;
  color: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const SEED: Recipe[] = [
  {
    id: "1", name: "Bolo de Chocolate", category: "Sobremesa", prepTime: 40,
    difficulty: "Médio", favorite: true, emoji: "🍫", color: "#7C3F00",
    ingredients: "2 xícaras de farinha\n1 xícara de cacau em pó\n2 ovos\n1 xícara de açúcar\n1 xícara de leite\n1/2 xícara de manteiga\n1 colher de fermento",
    instructions: "1. Pré-aqueça o forno a 180°C.\n2. Misture os ingredientes secos.\n3. Adicione os ovos, leite e manteiga derretida.\n4. Misture até obter uma massa homogênea.\n5. Despeje em forma untada e asse por 35 minutos.",
  },
  {
    id: "2", name: "Tapioca com Queijo", category: "Café da manhã", prepTime: 10,
    difficulty: "Fácil", favorite: false, emoji: "🥞", color: "#B45309",
    ingredients: "4 colheres de goma de tapioca\n2 fatias de queijo mussarela\n1 pitada de sal",
    instructions: "1. Espalhe a goma na frigideira em fogo médio.\n2. Aguarde solidificar (2 min).\n3. Adicione o queijo.\n4. Dobre ao meio e sirva.",
  },
  {
    id: "3", name: "Arroz com Feijão", category: "Almoço", prepTime: 30,
    difficulty: "Fácil", favorite: true, emoji: "🍚", color: "#15803D",
    ingredients: "2 xícaras de arroz\n1 lata de feijão carioca\n2 dentes de alho\n1/2 cebola\nSal, óleo e cheiro-verde a gosto",
    instructions: "1. Refogue alho e cebola no óleo.\n2. Adicione o arroz e refogue por 2 minutos.\n3. Adicione água quente (proporção 1:2) e sal.\n4. Cozinhe tampado em fogo baixo por 15 min.\n5. Aqueça o feijão separado e sirva junto.",
  },
  {
    id: "4", name: "Frango Grelhado", category: "Jantar", prepTime: 25,
    difficulty: "Fácil", favorite: false, emoji: "🍗", color: "#C2410C",
    ingredients: "2 filés de frango\n2 dentes de alho amassados\nSuco de 1 limão\nSal, pimenta e azeite",
    instructions: "1. Marine o frango com alho, limão, sal e pimenta por 20 min.\n2. Aqueça uma frigideira com azeite em fogo alto.\n3. Grelhe por 5-6 minutos cada lado.\n4. Sirva com salada.",
  },
  {
    id: "5", name: "Vitamina de Banana", category: "Lanches", prepTime: 5,
    difficulty: "Fácil", favorite: false, emoji: "🍌", color: "#A16207",
    ingredients: "2 bananas maduras\n1 copo de leite\n1 colher de mel\n1 colher de aveia",
    instructions: "1. Coloque todos os ingredientes no liquidificador.\n2. Bata por 1 minuto até ficar cremoso.\n3. Sirva gelado.",
  },
];

const CATEGORIES: Category[] = ["Todos", "Café da manhã", "Almoço", "Jantar", "Sobremesa", "Lanches"];
const DIFFICULTIES: Difficulty[] = ["Fácil", "Médio", "Difícil"];
const EMOJIS = ["🍕","🍝","🥗","🍜","🥘","🍲","🥩","🍗","🥞","🧇","🍳","🥚","🍱","🥙","🌮","🌯","🫔","🥫","🍛","🍣","🍤","🍙","🍚","🥟","🦑","🥓","🥦","🥕","🌽","🍆","🥑","🍅","🫑","🧅","🧄","🥜","🫘","🍞","🥐","🥨","🧀","🥧","🍰","🎂","🍫","🍮","🍭","🍬","🍦","🧁","🍩","🍪","🫐","🍇","🍓","🍒","🍑","🥭","🍍","🥝","🍋","🍊","🍎","🍌","🍉","🍈"];
const COLORS = ["#7C3F00","#B45309","#15803D","#C2410C","#A16207","#1D4ED8","#7C3AED","#BE185D","#0F766E","#9F1239"];

// ── Storage ───────────────────────────────────────────────────────────────────

function loadRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem("receitaapp-v1");
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
}
function saveRecipes(recipes: Recipe[]) {
  localStorage.setItem("receitaapp-v1", JSON.stringify(recipes));
}

// ── Difficulty badge ──────────────────────────────────────────────────────────

function DiffBadge({ d }: { d: Difficulty }) {
  const map: Record<Difficulty, string> = {
    "Fácil": "bg-emerald-100 text-emerald-800",
    "Médio": "bg-amber-100 text-amber-800",
    "Difícil": "bg-red-100 text-red-800",
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[d]}`}>{d}</span>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center col-span-full">
      <BookOpen size={48} className="text-stone-300" />
      <p className="text-stone-500 text-base">Nenhuma receita encontrada.</p>
      <button onClick={onNew} className="mt-2 px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
        Adicionar receita
      </button>
    </div>
  );
}

// ── Form modal ────────────────────────────────────────────────────────────────

function RecipeForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Recipe;
  onSave: (r: Recipe) => void;
  onClose: () => void;
}) {
  const blank: Omit<Recipe, "id"> = {
    name: "", category: "Almoço", prepTime: 30, difficulty: "Fácil",
    ingredients: "", instructions: "", favorite: false,
    emoji: "🍽️", color: COLORS[0],
  };
  const [form, setForm] = useState<Omit<Recipe, "id">>(initial ? { ...initial } : blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(k: K, v: typeof form[K]) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => { const n = { ...e }; delete n[k as string]; return n; });
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.ingredients.trim()) e.ingredients = "Ingredientes obrigatórios";
    if (!form.instructions.trim()) e.instructions = "Modo de preparo obrigatório";
    if (form.prepTime < 1) e.prepTime = "Tempo deve ser maior que 0";
    return e;
  }

  function submit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, id: initial?.id ?? String(Date.now()) });
  }

  const field = "flex flex-col gap-1";
  const label = "text-xs font-semibold text-stone-600 uppercase tracking-wide";
  const input = "border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";
  const err = "text-xs text-red-500 mt-0.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="font-bold text-stone-800 text-base">{initial ? "Editar receita" : "Nova receita"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Emoji + nome */}
          <div className="flex gap-3 items-start">
            <div className={field} style={{ flex: "0 0 auto" }}>
              <span className={label}>Ícone</span>
              <select value={form.emoji} onChange={e => set("emoji", e.target.value)} className={`${input} text-xl w-16 text-center`}>
                {EMOJIS.map(em => <option key={em} value={em}>{em}</option>)}
              </select>
            </div>
            <div className={field} style={{ flex: 1 }}>
              <span className={label}>Nome da receita</span>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ex: Frango ao curry" className={`${input} ${errors.name ? "border-red-400" : ""}`} />
              {errors.name && <span className={err}>{errors.name}</span>}
            </div>
          </div>

          {/* Categoria + Dificuldade */}
          <div className="grid grid-cols-2 gap-3">
            <div className={field}>
              <span className={label}>Categoria</span>
              <select value={form.category} onChange={e => set("category", e.target.value as Recipe["category"])} className={input}>
                {CATEGORIES.filter(c => c !== "Todos").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={field}>
              <span className={label}>Dificuldade</span>
              <div className="flex gap-1 pt-1">
                {DIFFICULTIES.map(d => (
                  <button key={d} onClick={() => set("difficulty", d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all
                      ${form.difficulty === d ? "bg-orange-500 text-white border-orange-500" : "bg-white text-stone-600 border-stone-200 hover:border-orange-300"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tempo + cor */}
          <div className="grid grid-cols-2 gap-3">
            <div className={field}>
              <span className={label}>Tempo de preparo (min)</span>
              <input type="number" min={1} value={form.prepTime} onChange={e => set("prepTime", Number(e.target.value))} className={`${input} ${errors.prepTime ? "border-red-400" : ""}`} />
              {errors.prepTime && <span className={err}>{errors.prepTime}</span>}
            </div>
            <div className={field}>
              <span className={label}>Cor do card</span>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {COLORS.map(c => (
                  <button key={c} onClick={() => set("color", c)}
                    style={{ background: c }}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${form.color === c ? "ring-2 ring-offset-1 ring-stone-700 scale-110" : ""}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Ingredientes */}
          <div className={field}>
            <span className={label}>Ingredientes <span className="normal-case font-normal text-stone-400">(um por linha)</span></span>
            <textarea rows={4} value={form.ingredients} onChange={e => set("ingredients", e.target.value)}
              placeholder={"2 xícaras de farinha\n3 ovos\n1 colher de açúcar"}
              className={`${input} resize-none ${errors.ingredients ? "border-red-400" : ""}`} />
            {errors.ingredients && <span className={err}>{errors.ingredients}</span>}
          </div>

          {/* Modo de preparo */}
          <div className={field}>
            <span className={label}>Modo de preparo</span>
            <textarea rows={5} value={form.instructions} onChange={e => set("instructions", e.target.value)}
              placeholder={"1. Pré-aqueça o forno a 180°C.\n2. Misture os ingredientes..."}
              className={`${input} resize-none ${errors.instructions ? "border-red-400" : ""}`} />
            {errors.instructions && <span className={err}>{errors.instructions}</span>}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-stone-100 sticky bottom-0 bg-white rounded-b-2xl">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:bg-stone-50 transition-colors">Cancelar</button>
          <button onClick={submit} className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
            <Check size={16} /> Salvar receita
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail view ───────────────────────────────────────────────────────────────

function RecipeDetail({
  recipe,
  onBack,
  onEdit,
  onDelete,
  onToggleFav,
}: {
  recipe: Recipe;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFav: () => void;
}) {
  const ingredients = recipe.ingredients.split("\n").filter(Boolean);
  const steps = recipe.instructions.split("\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="relative h-48 md:h-64 flex items-end pb-6 px-5" style={{ background: recipe.color }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          <div className="relative z-10 flex items-end justify-between w-full">
            <div>
              <span className="text-4xl md:text-5xl">{recipe.emoji}</span>
              <h1 className="text-white font-bold text-2xl md:text-3xl mt-2 leading-tight">{recipe.name}</h1>
            </div>
          </div>
          <button onClick={onBack} className="absolute top-4 left-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <button onClick={onToggleFav} className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors">
            <Heart size={20} fill={recipe.favorite ? "white" : "none"} />
          </button>
        </div>

        {/* Meta pills */}
        <div className="flex gap-2 px-5 py-4 flex-wrap bg-white md:bg-transparent">
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-3 py-1 text-sm text-stone-600">
            <Clock size={14} className="text-orange-400" /> {recipe.prepTime} min
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-full px-3 py-1 text-sm text-stone-600">
            <ChefHat size={14} className="text-orange-400" /> {recipe.category}
          </span>
          <DiffBadge d={recipe.difficulty} />
        </div>

        {/* Content */}
        <div className="px-5 pb-32 md:pb-6 flex flex-col gap-6">
          {/* Ingredientes */}
          <section className="bg-white md:rounded-2xl md:p-5 md:shadow-sm md:border md:border-stone-100 -mx-5 px-5 py-4 md:mx-0">
            <h2 className="font-bold text-stone-800 text-base mb-3">Ingredientes</h2>
            <ul className="flex flex-col gap-2">
              {ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full border-2 border-orange-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                  </span>
                  <span className="text-stone-600 text-sm leading-relaxed">{ing}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Modo de preparo */}
          <section className="bg-white md:rounded-2xl md:p-5 md:shadow-sm md:border md:border-stone-100 -mx-5 px-5 py-4 md:mx-0">
            <h2 className="font-bold text-stone-800 text-base mb-3">Modo de preparo</h2>
            <ol className="flex flex-col gap-3">
              {steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-stone-600 text-sm leading-relaxed">{step.replace(/^\d+\.\s*/, "")}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Actions - visible inline on desktop only */}
          <div className="hidden md:flex gap-3 pb-4">
            <button onClick={onEdit} className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors">
              <Edit3 size={16} /> Editar
            </button>
            <button onClick={onDelete} className="py-3 px-6 rounded-xl border border-red-100 bg-red-50 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>

        {/* Bottom actions - mobile only (fixed) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-5 py-4 flex gap-3">
          <button onClick={onEdit} className="flex-1 py-3 rounded-xl border border-stone-200 text-stone-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors">
            <Edit3 size={16} /> Editar
          </button>
          <button onClick={onDelete} className="py-3 px-4 rounded-xl border border-red-100 bg-red-50 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Recipe card ───────────────────────────────────────────────────────────────

function RecipeCard({ recipe, onClick, onFav }: { recipe: Recipe; onClick: () => void; onFav: (e: React.MouseEvent) => void }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
      <div className="h-28 md:h-36 flex items-center justify-center text-5xl md:text-6xl relative" style={{ background: recipe.color + "22" }}>
        <span>{recipe.emoji}</span>
        <button onClick={onFav} className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors">
          <Heart size={14} className={recipe.favorite ? "fill-red-400 text-red-400" : "text-stone-300"} />
        </button>
      </div>
      <div className="p-3 md:p-4">
        <p className="font-semibold text-stone-800 text-sm leading-tight mb-2">{recipe.name}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-stone-400">
            <Clock size={11} /> {recipe.prepTime} min
          </span>
          <DiffBadge d={recipe.difficulty} />
        </div>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

type View = { screen: "list" } | { screen: "detail"; id: string } | { screen: "form"; id?: string };

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>(loadRecipes);
  const [view, setView] = useState<View>({ screen: "list" });
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<Category>("Todos");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { saveRecipes(recipes); }, [recipes]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg: string) { setToast(msg); }

  function saveRecipe(r: Recipe) {
    setRecipes(prev => prev.some(x => x.id === r.id) ? prev.map(x => x.id === r.id ? r : x) : [...prev, r]);
    setView({ screen: "detail", id: r.id });
    showToast(r.id === (view as any).id ? "Receita atualizada!" : "Receita salva!");
  }

  function deleteRecipe(id: string) {
    setRecipes(prev => prev.filter(r => r.id !== id));
    setView({ screen: "list" });
    showToast("Receita removida.");
  }

  function toggleFav(id: string) {
    setRecipes(prev => prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r));
  }

  const filtered = recipes.filter(r => {
    const matchCat = cat === "Todos" || r.category === cat;
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // ── Detail screen ──
  if (view.screen === "detail") {
    const recipe = recipes.find(r => r.id === view.id);
    if (!recipe) { setView({ screen: "list" }); return null; }
    return (
      <>
        <RecipeDetail
          recipe={recipe}
          onBack={() => setView({ screen: "list" })}
          onEdit={() => setView({ screen: "form", id: recipe.id })}
          onDelete={() => deleteRecipe(recipe.id)}
          onToggleFav={() => toggleFav(recipe.id)}
        />
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}
      </>
    );
  }

  // ── Form screen ──
  if (view.screen === "form") {
    const initial = view.id ? recipes.find(r => r.id === view.id) : undefined;
    return (
      <>
        <RecipeForm
          initial={initial}
          onSave={saveRecipe}
          onClose={() => setView(view.id ? { screen: "detail", id: view.id } : { screen: "list" })}
        />
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-stone-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            {toast}
          </div>
        )}
      </>
    );
  }

  // ── List screen ──
  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Header - full width bg, conteúdo centralizado */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-stone-800">🍽️ ReceitaApp</h1>
              <p className="text-xs text-stone-400">{recipes.length} receitas salvas</p>
            </div>
            <button
              onClick={() => setView({ screen: "form" })}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-200"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nova receita</span>
              <span className="sm:hidden">Nova</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar receitas..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all"
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                  ${cat === c ? "bg-orange-500 text-white shadow-sm" : "bg-stone-100 text-stone-500 hover:bg-stone-200"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid - centralizado com breakpoints */}
      <div className="max-w-5xl mx-auto px-5 py-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filtered.length === 0
            ? <EmptyState onNew={() => setView({ screen: "form" })} />
            : filtered.map(r => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  onClick={() => setView({ screen: "detail", id: r.id })}
                  onFav={e => { e.stopPropagation(); toggleFav(r.id); }}
                />
              ))
          }
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-800 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

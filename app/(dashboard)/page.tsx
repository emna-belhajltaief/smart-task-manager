import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function DashboardPage() {
  const mockStats = {
    total_tasks_created: 42,
    total_tasks_completed: 28,
    current_streak: 5,
    longest_streak: 12
  };

  const mockBoards = [
    {
      id: "1",
      name: "🏠 Projet Personnel",
      description: "Mes tâches quotidiennes et objectifs",
      created_at: "2024-01-15"
    },
    {
      id: "2",
      name: "💼 Travail",
      description: "Tâches professionnelles",
      created_at: "2024-02-01"
    },
    {
      id: "3",
      name: "📚 Études",
      description: "Cours et devoirs",
      created_at: "2024-02-10"
    }
  ];

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <span className="px-3 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
            MODE DÉMO
          </span>
        </div>
        <p className="text-gray-600 text-lg">
          Bienvenue <strong>admin@test.com</strong> ! 👋
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              TÂCHES CRÉÉES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{mockStats.total_tasks_created}</div>
            <p className="text-xs text-gray-500 mt-2">Total de tâches</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              TÂCHES COMPLÉTÉES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{mockStats.total_tasks_completed}</div>
            <p className="text-xs text-gray-500 mt-2">
              {((mockStats.total_tasks_completed / mockStats.total_tasks_created) * 100).toFixed(0)}% de complétion
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-2 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-gray-600">
              STREAK ACTUEL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{mockStats.current_streak} jours</div>
            <p className="text-xs text-gray-500 mt-2">
              🔥 Record : {mockStats.longest_streak} jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* BOARDS */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Mes Boards</h2>
          <Button className="gap-2 h-11 px-6 font-semibold">
            <PlusCircle className="w-5 h-5" />
            Nouveau Board
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockBoards.map((board) => (
            <Card key={board.id} className="border-2 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer">
              <CardHeader>
                <CardTitle className="text-xl">{board.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  {board.description}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-400">
                  📅 Créé le {new Date(board.created_at).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* LOGOUT BUTTON */}
      <div className="flex justify-center pt-8">
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => {
            alert("Déconnexion...");
            window.location.href = "/login";
          }}
        >
          🚪 Se déconnecter
        </Button>
      </div>
    </div>
  );
}
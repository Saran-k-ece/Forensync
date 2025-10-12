import { useState, useEffect } from 'react';
import { Package, TrendingUp, MapPin, Activity, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import EvidenceTable from '../components/EvidenceTable';
import { evidenceApi } from '../services/api';

const Dashboard = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    locations: 0,
    inTransit: 0,
  });

  const fetchEvidence = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await evidenceApi.getAll();
      setEvidence(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error fetching evidence:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const calculateStats = (data) => {
    const uniqueLocations = new Set(data.map((item) => item.location));
    const newCount = data.filter((item) => item.isNew).length;
    const inTransitCount = data.filter((item) => item.status === 'In Transit').length;

    setStats({
      total: data.length,
      new: newCount,
      locations: uniqueLocations.size,
      inTransit: inTransitCount,
    });
  };

  useEffect(() => {
    fetchEvidence();

    const interval = setInterval(() => {
      fetchEvidence(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading evidence data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Evidence Dashboard</h2>
            <p className="text-gray-600 mt-1">Real-time evidence tracking and management</p>
          </div>
          <button
            onClick={() => fetchEvidence(true)}
            disabled={refreshing}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Evidence"
            value={stats.total}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="New Entries"
            value={stats.new}
            icon={TrendingUp}
            color="green"
          />
          <StatsCard
            title="Locations"
            value={stats.locations}
            icon={MapPin}
            color="purple"
          />
          <StatsCard
            title="In Transit"
            value={stats.inTransit}
            icon={Activity}
            color="yellow"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Records</h3>
          <EvidenceTable
            evidence={evidence}
            onUpdate={() => fetchEvidence(true)}
            onDelete={() => fetchEvidence(true)}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { useState, useEffect, useRef } from 'react';
import { Package, TrendingUp, MapPin, Activity, RefreshCw, Bell } from 'lucide-react';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import EvidenceTable from '../components/EvidenceTable';
import { evidenceApi } from '../services/api';

const Dashboard = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ total: 0, new: 0, locations: 0, inTransit: 0 });
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState({ status: '', location: '' });
  const [lastUpdated, setLastUpdated] = useState(null);

  const prevEvidenceRef = useRef([]);

  const fetchEvidence = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await evidenceApi.getAll();

      // Find new entries
      const prevIds = prevEvidenceRef.current.map((e) => e._id);
      const newEntries = data.filter((e) => !prevIds.includes(e._id));
      if (newEntries.length > 0) {
        newEntries.forEach((entry) => notifyNewEvidence(entry));
      }

      prevEvidenceRef.current = data;
      setEvidence(data);
      calculateStats(data);
      setLastUpdated(new Date());
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

  // Notifications
  const notifyNewEvidence = (entry) => {
    setNotifications((prev) => [
      ...prev,
       { id: entry._id, message: `New evidence received with Tag ID: ${entry.tagId || 'Unknown'}`, entry },
    ]);

    // Auto-remove notification after 10 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== entry._id));
    }, 10000);
  };

  const handleNotificationClick = async (entryId) => {
    try {
      await evidenceApi.markViewed(entryId);
      setEvidence((prev) =>
        prev.map((e) => (e._id === entryId ? { ...e, isNew: false } : e))
      );
      setNotifications((prev) => prev.filter((n) => n.id !== entryId));
    } catch (error) {
      console.error('Error marking evidence viewed:', error);
    }
  };

  const markAllViewed = async () => {
    try {
      const newEvidence = evidence.filter((e) => e.isNew);
      await Promise.all(newEvidence.map((e) => evidenceApi.markViewed(e._id)));
      setEvidence((prev) => prev.map((e) => ({ ...e, isNew: false })));
      setNotifications([]);
    } catch (error) {
      console.error('Error marking all viewed:', error);
    }
  };

  // Filtered evidence
  const filteredEvidence = evidence.filter(
    (e) =>
      (filter.status ? e.status === filter.status : true) &&
      (filter.location ? e.location.toLowerCase().includes(filter.location.toLowerCase()) : true)
  );

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
    <div className="min-h-screen bg-gray-50 relative">
      <Header />

      {/* Notifications */}
      <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleNotificationClick(n.entry._id)}
            className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 animate-slide-in"
          >
            <Bell className="w-4 h-4" />
            <span>{n.message}</span>
          </div>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Evidence Dashboard</h2>
            <p className="text-gray-600 mt-1">Real-time evidence tracking and management</p>
            {lastUpdated && (
              <p className="text-gray-400 text-sm mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => fetchEvidence(true)}
              disabled={refreshing}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={markAllViewed}
              className="btn-secondary flex items-center gap-2"
            >
              Mark All Viewed
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Evidence" value={stats.total} icon={Package} color="blue" />
          <StatsCard title="New Entries" value={stats.new} icon={TrendingUp} color="green" />
          <StatsCard title="Locations" value={stats.locations} icon={MapPin} color="purple" />
          <StatsCard title="In Transit" value={stats.inTransit} icon={Activity} color="yellow" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option value="">All Status</option>
            <option value="Collected">Collected</option>
            <option value="In Transit">In Transit</option>
            <option value="Stored">Stored</option>
            <option value="Under Analysis">Under Analysis</option>
            <option value="Released">Released</option>
          </select>
          <input
            type="text"
            placeholder="Filter by location"
            value={filter.location}
            onChange={(e) => setFilter({ ...filter, location: e.target.value })}
            className="border px-2 py-1 rounded"
          />
        </div>

        {/* Evidence Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Records</h3>
          <EvidenceTable
            evidence={filteredEvidence}
            onUpdate={() => fetchEvidence(true)}
            onDelete={() => fetchEvidence(true)}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  Server, 
  Cpu, 
  HardDrive, 
  Clock, 
  Users, 
  Zap, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HealthMetrics {
  uptime: number;
  startTime: number;
  memoryUsed: number;
  memoryMax: number;
  cpuUsage: number;
  diskFree: number;
  diskTotal: number;
  activeRequests: number;
  threadCount: number;
  activeSessions: number;
}

interface MetricResponse {
  name: string;
  measurements: Array<{
    statistic: string;
    value: number;
  }>;
  availableTags: Array<{
    tag: string;
    values: string[];
  }>;
}

const HealthDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(30000); // Default 30 seconds

  const fetchMetric = async (metricName: string): Promise<number> => {
    try {
      const response = await fetch(`/actuator/metrics/${metricName}`);
      
      if (!response.ok) {
        console.error(`HTTP ${response.status} for metric ${metricName}:`, response.statusText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || (!contentType.includes('application/json') && !contentType.includes('application/vnd.spring-boot.actuator'))) {
        const text = await response.text();
        console.error(`Non-JSON response for metric ${metricName}:`, text);
        throw new Error(`Expected JSON response, got: ${contentType}`);
      }
      
      const data: MetricResponse = await response.json();
      
      if (!data.measurements || data.measurements.length === 0) {
        console.warn(`No measurements found for metric ${metricName}`);
        return 0;
      }
      
      // Handle metrics with multiple measurements by selecting the most relevant one
      let measurement = data.measurements[0];
      
      // For active requests, prefer ACTIVE_TASKS over DURATION
      if (metricName === 'http.server.requests.active') {
        const activeTasksMeasurement = data.measurements.find(m => m.statistic === 'ACTIVE_TASKS');
        if (activeTasksMeasurement) {
          measurement = activeTasksMeasurement;
        }
      }
      
      const value = measurement?.value || 0;
      return value;
    } catch (error) {
      console.error(`Failed to fetch metric ${metricName}:`, error);
      return 0;
    }
  };

  const fetchAllMetrics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First, test if actuator endpoint is available
      const healthResponse = await fetch('/actuator/health');
      if (!healthResponse.ok) {
        throw new Error(`Spring Boot Actuator not available (HTTP ${healthResponse.status}). Make sure the backend is running on localhost:8080 with actuator endpoints enabled.`);
      }

      const [
        uptime,
        startTime,
        memoryUsed,
        memoryMax,
        cpuUsage,
        diskFree,
        diskTotal,
        activeRequests,
        threadCount,
        activeSessions
      ] = await Promise.all([
        fetchMetric('process.uptime'),
        fetchMetric('process.start.time'),
        fetchMetric('jvm.memory.used'),
        fetchMetric('jvm.memory.max'),
        fetchMetric('process.cpu.usage'),
        fetchMetric('disk.free'),
        fetchMetric('disk.total'),
        fetchMetric('http.server.requests.active'),
        fetchMetric('jvm.threads.live'),
        fetchMetric('tomcat.sessions.active.current')
      ]);
      
      setMetrics({
        uptime,
        startTime,
        memoryUsed,
        memoryMax,
        cpuUsage: cpuUsage * 100, // Convert to percentage
        diskFree,
        diskTotal,
        activeRequests,
        threadCount,
        activeSessions
      });

      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch metrics';
      console.error('Error fetching health metrics:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchAllMetrics, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, fetchAllMetrics]);

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadge = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) {
      return (
        <Badge className="gap-1.5 bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
          <AlertCircle className="w-3 h-3" />
          Critical
        </Badge>
      );
    } else if (value >= thresholds.warning) {
      return (
        <Badge className="gap-1.5 bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
          <AlertTriangle className="w-3 h-3" />
          Warning
        </Badge>
      );
    } else {
      return (
        <Badge className="gap-1.5 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
          <CheckCircle className="w-3 h-3" />
          Healthy
        </Badge>
      );
    }
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading && !metrics) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Health & Status Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading Health Metrics...</h3>
            <p className="text-slate-500">Fetching real-time system status</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !metrics) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-rose-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            Health & Status Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Health Metrics Unavailable</h3>
            <p className="text-slate-500 mb-4">{error}</p>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left max-w-2xl mx-auto">
              <h4 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Setup Requirements
              </h4>
              <div className="text-sm text-amber-700 space-y-2">
                <p><strong>1.</strong> Ensure Spring Boot is running on <code className="bg-amber-100 px-1 rounded">localhost:8080</code></p>
                <p><strong>2.</strong> Add <code className="bg-amber-100 px-1 rounded">spring-boot-starter-actuator</code> dependency</p>
                <p><strong>3.</strong> Enable metrics in application.properties:</p>
                <div className="bg-amber-100 p-2 rounded text-xs font-mono mt-1">
                  management.endpoints.web.exposure.include=health,metrics<br/>
                  management.endpoint.health.show-details=always
                </div>
                <p><strong>4.</strong> Verify: <code className="bg-amber-100 px-1 rounded">curl http://localhost:8080/actuator/health</code></p>
              </div>
            </div>
            
            <Button onClick={fetchAllMetrics} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) return null;

  const memoryPercentage = (metrics.memoryUsed / metrics.memoryMax) * 100;
  const diskUsedPercentage = ((metrics.diskTotal - metrics.diskFree) / metrics.diskTotal) * 100;

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Health & Status Dashboard
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Refresh Interval Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 font-medium">Interval:</span>
              <Select
                value={refreshInterval.toString()}
                onValueChange={(value) => setRefreshInterval(parseInt(value))}
                disabled={!autoRefresh}
              >
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5000">5s</SelectItem>
                  <SelectItem value="10000">10s</SelectItem>
                  <SelectItem value="30000">30s</SelectItem>
                  <SelectItem value="60000">1m</SelectItem>
                  <SelectItem value="300000">5m</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Auto-refresh Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`gap-2 transition-all duration-200 ${autoRefresh ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'hover:bg-slate-50'}`}
            >
              <Zap className={`w-4 h-4 ${autoRefresh ? 'animate-pulse text-green-600' : ''}`} />
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            </Button>
            
            {/* Manual Refresh */}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAllMetrics}
              disabled={isLoading}
              className="gap-2 hover:scale-105 transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Application Uptime */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Uptime</span>
                </div>
                {getStatusBadge(0, { warning: 50, critical: 80 })}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-green-900">{formatUptime(metrics.uptime)}</p>
                <p className="text-sm text-green-600">
                  Started: {new Date(metrics.startTime * 1000).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Memory Usage */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Memory</span>
                </div>
                {getStatusBadge(memoryPercentage, { warning: 75, critical: 90 })}
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">Used: {formatBytes(metrics.memoryUsed)}</span>
                    <span className="text-blue-600">{memoryPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${Math.min(memoryPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  Total: {formatBytes(metrics.memoryMax)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CPU Usage */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-800">CPU</span>
                </div>
                {getStatusBadge(metrics.cpuUsage, { warning: 70, critical: 90 })}
              </div>
              <div className="space-y-3">
                <p className="text-2xl font-bold text-purple-900">{metrics.cpuUsage.toFixed(1)}%</p>
                <div className="w-full bg-purple-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${Math.min(metrics.cpuUsage, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disk Space */}
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-800">Disk</span>
                </div>
                {getStatusBadge(diskUsedPercentage, { warning: 80, critical: 95 })}
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-700">Used: {formatBytes(metrics.diskTotal - metrics.diskFree)}</span>
                    <span className="text-orange-600">{diskUsedPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-orange-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${Math.min(diskUsedPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-orange-600">
                  Free: {formatBytes(metrics.diskFree)} / Total: {formatBytes(metrics.diskTotal)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Active HTTP Requests */}
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-600" />
                  <span className="font-medium text-cyan-800">Active Requests</span>
                </div>
                {getStatusBadge(metrics.activeRequests, { warning: 50, critical: 100 })}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-cyan-900">{metrics.activeRequests}</p>
                <p className="text-sm text-cyan-600">HTTP connections</p>
              </div>
            </CardContent>
          </Card>

          {/* Thread Count */}
          <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-rose-800">Threads</span>
                </div>
                {getStatusBadge(metrics.threadCount, { warning: 200, critical: 300 })}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-rose-900">{metrics.threadCount}</p>
                <p className="text-sm text-rose-600">Live JVM threads</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="font-medium text-indigo-800">Sessions</span>
                </div>
                {getStatusBadge(metrics.activeSessions, { warning: 100, critical: 200 })}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-indigo-900">{metrics.activeSessions}</p>
                <p className="text-sm text-indigo-600">Active user sessions</p>
              </div>
            </CardContent>
          </Card>

          {/* System Status Summary */}
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-800">System Status</span>
                </div>
                {getStatusBadge(Math.max(memoryPercentage, metrics.cpuUsage, diskUsedPercentage), { warning: 75, critical: 90 })}
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Memory:</span>
                    <span className={`font-medium ${memoryPercentage > 75 ? 'text-red-600' : 'text-green-600'}`}>
                      {memoryPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">CPU:</span>
                    <span className={`font-medium ${metrics.cpuUsage > 70 ? 'text-red-600' : 'text-green-600'}`}>
                      {metrics.cpuUsage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Disk:</span>
                    <span className={`font-medium ${diskUsedPercentage > 80 ? 'text-red-600' : 'text-green-600'}`}>
                      {diskUsedPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Threads:</span>
                    <span className={`font-medium ${metrics.threadCount > 200 ? 'text-red-600' : 'text-green-600'}`}>
                      {metrics.threadCount}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthDashboard;

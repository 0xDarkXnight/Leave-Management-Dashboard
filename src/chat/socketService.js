const CHANNEL_NAME       = "lms_realtime_v1";
const HEARTBEAT_INTERVAL = 25_000;
const PRESENCE_TIMEOUT   = 62_000;

class LMSSocketService {
  constructor() {
    this._listeners      = new Map();
    this._channel        = null;
    this._userId         = null;
    this._heartbeatTimer = null;
    this._presenceTimers = new Map();
    this._connected      = false;
    this._onVisibility   = null;
  }


  connect(userId) {
    if (this._connected && this._userId === userId) return this;
    if (this._connected) this.disconnect();

    this._userId  = userId;
    this._channel = new BroadcastChannel(CHANNEL_NAME);

    this._channel.onmessage = ({ data }) => {
      try {
        const { event, payload } = data;
        this._trigger(event, payload);
      } catch { /* malformed message – ignore */ }
    };

    this._connected = true;

    this._broadcast("presence_online", { userId });

    this._heartbeatTimer = setInterval(() => {
      this._broadcast("presence_heartbeat", { userId });
    }, HEARTBEAT_INTERVAL);

    this._onVisibility = () => {
      if (document.hidden) {
        this._broadcast("presence_away", { userId });
      } else {
        this._broadcast("presence_online", { userId });
      }
    };
    document.addEventListener("visibilitychange", this._onVisibility);

    return this;
  }

  disconnect() {
    if (!this._connected) return;

    this._broadcast("presence_offline", { userId: this._userId });

    clearInterval(this._heartbeatTimer);
    this._heartbeatTimer = null;

    this._presenceTimers.forEach(clearTimeout);
    this._presenceTimers.clear();

    if (this._onVisibility) {
      document.removeEventListener("visibilitychange", this._onVisibility);
      this._onVisibility = null;
    }

    this._channel?.close();
    this._channel  = null;
    this._userId   = null;
    this._connected = false;
  }

  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
    return this;
  }

  off(event, callback) {
    this._listeners.get(event)?.delete(callback);
    return this;
  }

  broadcast(event, payload) {
    this._broadcast(event, payload);
    return this;
  }

  emit(event, payload) {
    return this.broadcast(event, payload);
  }

  resetPresenceTimer(userId, onTimeout) {
    const existing = this._presenceTimers.get(userId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this._presenceTimers.delete(userId);
      onTimeout(userId);
    }, PRESENCE_TIMEOUT);

    this._presenceTimers.set(userId, timer);
  }

  clearPresenceTimer(userId) {
    const t = this._presenceTimers.get(userId);
    if (t) { clearTimeout(t); this._presenceTimers.delete(userId); }
  }

  _broadcast(event, payload) {
    if (!this._channel) return;
    try { this._channel.postMessage({ event, payload }); } catch { /* closed */ }
  }

  _trigger(event, payload) {
    this._listeners.get(event)?.forEach((cb) => {
      try { cb(payload); } catch (err) {
        console.error(`[Socket] Listener error on "${event}":`, err);
      }
    });
  }

  get isConnected() { return this._connected; }
  get currentUserId() { return this._userId; }
}

export const socketService = new LMSSocketService();
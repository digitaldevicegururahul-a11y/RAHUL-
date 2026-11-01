/**
 * Router Master Pro - TypeScript Type Definitions
 */

export type RouterModelId = 
  | 'gx-earth-4222' 
  | 'airtel-aot-5221zy' 
  | 'airtel-ont' 
  | 'zte-zxhn-f670l';

export interface RouterProfile {
  id: RouterModelId;
  name: string;
  vendor: string;
  type: string;
  supportsDualBand: boolean;
  defaultIp: string;
  defaultUsername: string;
  defaultPassword: string;
  firmware: string;
  hardwareVersion: string;
  supportedBands: ('2.4GHz' | '5GHz')[];
  defaultChannel24: number;
  defaultChannel5: number;
  apiEndpoint: string;
  description: string;
}

export type ConnectionMode = 'live' | 'demo';

export interface ConnectionCredentials {
  ipAddress: string;
  port: number;
  protocol: 'http' | 'https';
  username: string;
  password: string;
  modelId: RouterModelId;
  mode: ConnectionMode;
}

export interface WifiBandConfig {
  enabled: boolean;
  ssid: string;
  password: string;
  securityMode: 'WPA2-PSK' | 'WPA2/WPA3-PSK' | 'WPA-PSK' | 'Open';
  channel: number | 'auto';
  channelWidth: '20MHz' | '40MHz' | '80MHz' | 'Auto';
  hideSsid: boolean;
  txPower: 25 | 50 | 75 | 100;
}

export interface RouterWifiConfig {
  bandMode: 'single' | 'dual';
  smartConnect: boolean; // Same SSID for both 2.4G & 5G
  wifi24: WifiBandConfig;
  wifi5: WifiBandConfig;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  band: '2.4GHz' | '5GHz' | 'LAN';
  signalDbm: number; // e.g. -45 dBm
  isBlocked: boolean;
  connectedSince: string;
  vendor: string;
  deviceType: 'phone' | 'laptop' | 'tv' | 'smart-home' | 'pc' | 'other';
}

export interface BlockedMacEntry {
  mac: string;
  name?: string;
  blockedAt: string;
  reason?: string;
}

export interface RouterSystemStatus {
  ip: string;
  macAddress: string;
  model: string;
  firmwareVersion: string;
  hardwareVersion: string;
  uptime: string;
  wanStatus: 'Connected' | 'Disconnected';
  wanIp: string;
  lanIp: string;
  subnetMask: string;
  primaryDns: string;
  secondaryDns: string;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
}

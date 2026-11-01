import { RouterProfile } from '../types/router';

export const SUPPORTED_ROUTERS: RouterProfile[] = [
  {
    id: 'gx-earth-4222',
    name: 'GX Earth-4222',
    vendor: 'Genexis / GX Group',
    type: 'GPON ONT Dual-Band Gateway',
    supportsDualBand: true,
    defaultIp: '192.168.1.1',
    defaultUsername: 'admin',
    defaultPassword: 'stdOnu101',
    firmware: 'V2.1.0_GX4222',
    hardwareVersion: 'HW_E4222_V1.3',
    supportedBands: ['2.4GHz', '5GHz'],
    defaultChannel24: 6,
    defaultChannel5: 36,
    apiEndpoint: '/cgi-bin/wlan.cgi',
    description: 'Genexis GX Earth-4222 4GE+2POTS+Wi-Fi AC Dual Band GPON ONT router.'
  },
  {
    id: 'airtel-aot-5221zy',
    name: 'Airtel AOT-5221ZY',
    vendor: 'Airtel Xstream Fiber (Arcadyan/ZTE OEM)',
    type: 'Dual-Band Gigabit Wi-Fi ONT',
    supportsDualBand: true,
    defaultIp: '192.168.1.1',
    defaultUsername: 'admin',
    defaultPassword: 'airtel@123',
    firmware: 'AOT_AIRTEL_V1.02.04',
    hardwareVersion: 'AOT-5221ZY-REV2',
    supportedBands: ['2.4GHz', '5GHz'],
    defaultChannel24: 1,
    defaultChannel5: 149,
    apiEndpoint: '/boaform/admin/formWlan',
    description: 'Airtel Xstream Fiber AOT-5221ZY AC1200 Gigabit Dual Band ONT.'
  },
  {
    id: 'airtel-ont',
    name: 'Airtel ONT (Standard)',
    vendor: 'Airtel Fiber (Nokia / DragonPath / Sercomm)',
    type: 'Standard Single-Band GPON Terminal',
    supportsDualBand: false,
    defaultIp: '192.168.1.1',
    defaultUsername: 'admin',
    defaultPassword: 'admin',
    firmware: 'ONT_STD_3.12.8',
    hardwareVersion: 'G-2425-STD',
    supportedBands: ['2.4GHz'],
    defaultChannel24: 11,
    defaultChannel5: 36,
    apiEndpoint: '/boaform/admin/wlanSetup',
    description: 'Standard Airtel Single-Band 2.4GHz GPON ONT Terminal.'
  },
  {
    id: 'zte-zxhn-f670l',
    name: 'ZTE ZXHN F670L',
    vendor: 'ZTE Corporation',
    type: 'Dual-Band AC1200 GPON ONT',
    supportsDualBand: true,
    defaultIp: '192.168.1.1',
    defaultUsername: 'admin',
    defaultPassword: 'admin',
    firmware: 'V9.0.10P1N19',
    hardwareVersion: 'ZXHN_F670L_V2',
    supportedBands: ['2.4GHz', '5GHz'],
    defaultChannel24: 6,
    defaultChannel5: 44,
    apiEndpoint: '/boaform/admin/formWlanSetup',
    description: 'ZTE ZXHN F670L AC1200 4GE+1POTS+Wi-Fi Dual Band GPON ONT.'
  }
];

export const getRouterById = (id: string): RouterProfile => {
  const found = SUPPORTED_ROUTERS.find((r) => r.id === id);
  return found || SUPPORTED_ROUTERS[0];
};

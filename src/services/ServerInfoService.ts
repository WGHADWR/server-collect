import { AppConfig } from '@/config/AppConfig';

export class ServerInfoService {

  public static async getServerInfo() {
    const url = AppConfig.ServerURL + '/server/info';
    const response = await fetch(url);
    return await response.json();
  }

}

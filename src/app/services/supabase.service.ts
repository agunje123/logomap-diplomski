import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment';
import { Kabinet } from '../model/kabinet';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  kabinetListSub = new Subject<Kabinet[]>();

  protected supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async pushKabinetList(kabinetList: Kabinet[]) {
    const insertData = kabinetList.map((kabinet) => {
      return {
        name: kabinet.name,
        address: kabinet.address,
        website: kabinet.website,
        phone_number: kabinet.phone_number,
        geometry: `POINT(${kabinet.longitude} ${kabinet.latitude})`,
      };
    });
    return this.supabase.from('kabineti').insert(insertData).select();
  }

  async getKabinetList() {
    let { data, error } = await this.supabase.rpc('get_kabinet_list');
    if (error) {
      console.error(error);
    } else {
      this.kabinetListSub.next(data);
    }
  }
}

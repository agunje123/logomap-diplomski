import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environment';
import { Kabinet } from '../model/kabinet';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
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
        phone_number: kabinet.phoneNumber,
        geometry: `POINT(${kabinet.longitude} ${kabinet.latitude})`,
      };
    });
    return this.supabase.from('kabineti').insert(insertData).select();
  }
}

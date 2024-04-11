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

  createKabinet(kabinetList: Kabinet[]) {
    kabinetList.forEach((kabinet) => {
      this.supabase.from('kabineti').insert({
        name: kabinet.name,
        address: kabinet.address,
        website: kabinet.website,
        phone_number: kabinet.phoneNumber,
        geometry: `POINT(${kabinet.longitude} ${kabinet.latitude})`,
      });
    });
  }

}

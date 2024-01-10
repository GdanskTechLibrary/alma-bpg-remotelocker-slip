export function __only_remotelocker(user_requests: Array<any>) {
 //        .filter(ur => ur.task_name === "Hold Shelf Request Slip Letter")//Transit Item")
    return user_requests
        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "Transit Item");
}
export function __only_holdshelf(user_requests: Array<any>) {
 //        .filter(ur => ur.task_name === "Hold Shelf Request Slip Letter")//Transit Item")
    console.log('before',user_requests);
    return user_requests
//        .filter(ur => ur.pickup_location_circulation_desk === "cd_remotelocker-requ")
        .filter(ur => ur.task_name === "On Hold Shelf");
}

export function __choice_user_barcode(user_datas:any): string 
  {
    console.log(user_datas);
    let add_id_1 = user_datas.user_identifier.filter(ui => ui.id_type.value === 'OTHER_ID_1')[0]?.value;
    let add_id_2 = user_datas.user_identifier.filter(ui => ui.id_type.value === 'OTHER_ID_2')[0]?.value;
    if (add_id_2) {
        if (user_datas.note_type.filter(nt => nt.note_text.value === "BARCODE").length !== 0
            && user_datas.note_type.filter(nt => nt.note_text === "mLegitymacja").length !== 0) {
                return add_id_2;
        }
    } else {
        if (add_id_1) {
            return add_id_1;
        }
    }
    // brak identyfikatora dla książkomatu
    if (user_datas.user_identifier.filter(ui => ui.id_type.value === 'BARCODE').length === 0) {
        return 'brak identyfikatora dla książkomatu';
    }
    return user_datas.user_identifier.filter(ui => ui.id_type.value === 'BARCODE')[0].value;
  }
export function __extract_user_name_description(user_datas:any): string 
  {
    return user_datas.full_name;// + (user_datas?.external_id !== "")?'poza PG':'';
  }
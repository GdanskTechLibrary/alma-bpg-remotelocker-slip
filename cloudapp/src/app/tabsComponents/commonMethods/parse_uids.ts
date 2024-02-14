function ___parse_uid_from_html(letter : string, unique_users_ids: Array<string>): string | void {
    var parser = new DOMParser();
    let user_primary_id_span_html = parser.parseFromString(letter,"text/html")
                                        .getElementById('PrimaryID')?.innerHTML;
    if (user_primary_id_span_html) {
            return user_primary_id_span_html;
    }
  }
export function __parse_unique_uids_from_printouts(printouts: Array<any>): Array<string> {
    let unique_users_ids = [];
    printouts.forEach((printout) => {
        let user_id = ___parse_uid_from_html(printout.letter, unique_users_ids)
        if (user_id) {
            unique_users_ids.push(user_id)
        }
    });
    return unique_users_ids.filter((value, index, array) => array.indexOf(value) === index);
  }


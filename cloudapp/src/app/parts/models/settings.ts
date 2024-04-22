interface OrderType {
    identify_type: string;
    order: number,
    checked: boolean,
}
interface OrderedIdentType {
  [ident: string]: [OrderType];
};

export class Settings {

  idents_ordered: any = [
    {
      "ident_ordered": {
        "code": "UNIV_ID",
        "description": "University ID (system number)",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 0
    },
    {
      "ident_ordered": {
        "code": "OTHER_ID_1",
        "description": "Additional ID 01",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 1
    },
    {
      "ident_ordered": {
        "code": "BARCODE",
        "description": "Barcode",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 2
    },
    {
      "ident_ordered": {
        "code": "OTHER_ID_2",
        "description": "Additional ID 02",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 3
    },
    {
      "ident_ordered": {
        "code": "OTHER_ID_3",
        "description": "Additional ID 03",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 4
    },
    {
      "ident_ordered": {
        "code": "OTHER_ID_4",
        "description": "Additional ID 04",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 5
    },
    {
      "ident_ordered": {
        "code": "OTHER_ID_5",
        "description": "Additional ID 05",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 6
    },
    {
      "ident_ordered": {
        "code": "TWITTER",
        "description": "Twitter ID for social login",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 7
    },
    {
      "ident_ordered": {
        "code": "GOOGLE",
        "description": "Google ID for social login",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 8
    },
    {
      "ident_ordered": {
        "code": "FACEBOOK",
        "description": "Facebook ID for social login",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 9
    },
    {
      "ident_ordered": {
        "code": "PG_PersonNumber",
        "description": "PG Person Number",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 10
    },
    {
      "ident_ordered": {
        "code": "PG_ELS",
        "description": "PG Kod ELS",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 11
    },
    {
      "ident_ordered": {
        "code": "PG_INDEX_NO",
        "description": "PG Nr legitymacji",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 12
    },
    {
      "ident_ordered": {
        "code": "10",
        "description": "ID",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 13
    },
    {
      "ident_ordered": {
        "code": "PG_STAFF_NO",
        "description": "Numer Pracownika",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 14
    },
    {
      "ident_ordered": {
        "code": "FARU_BARCODE",
        "description": "Barcode (FarU)",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 15
    },
    {
      "ident_ordered": {
        "code": "FARU_ELS",
        "description": "ELS (FarU)",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 16
    },
    {
      "ident_ordered": {
        "code": "FARU_INDEX_NO",
        "description": "Index Number (FarU)",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 17
    },
    {
      "ident_ordered": {
        "code": "FARU_OTHER_ID",
        "description": "Other ID (FarU)",
        "default": false,
        "enabled": true,
        "updated_by": "exl_impl",
        "update_date": "2024-01-10Z"
      },
      "index": 18
    }
  ];
    idents_checked = 
    [
        true, true, true, true, false, false, false, 
        false, false, false, false, false, false, false,
        false, false, false, false, false, false, false
    ];
}
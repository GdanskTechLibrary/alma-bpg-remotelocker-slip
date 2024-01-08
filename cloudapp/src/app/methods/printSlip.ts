export _send_requested_resources_to_printer():void {

        var section_to_print = document.getElementById('print_area');
        var window_to_print = window.open('', '_blank', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        window_to_print.document.write(section_to_print.innerHTML);
        window_to_print.document.close();
        window_to_print.focus();
        window_to_print.print();
        window_to_print.close();
    }

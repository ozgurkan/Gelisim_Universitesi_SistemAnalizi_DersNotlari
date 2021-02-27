/**
 * Onyx AJAX Kütüphanesi
 * 
 * @constructor
 * @class onyx
 * @param {object} args
 * @returns {onyx}
 */
function onyx(args){
    this.xhr = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP");
    this.options = {
        /**
         * AJAX isteği için kullanılacak metot
         * 
         * @public
         * @param {string} method "POST" veya "GET"
         */
        method  : this.isset(args.method, false),
        /**
         * AJAX isteğinin yapılacağı URL
         * 
         * @public
         * @param {string} url
         */
        url     : this.isset(args.url, false),
        /**
         * AJAX isteği asenkron'mu olacak ?
         * 
         * @public
         * @param {boolen} async "true" veya "false"
         */
        async   : this.isset(args.async, false),
        /**
         * AJAX isteği anında gönderilecek veri
         * 
         * @public
         * @param {string} data "anahtar=veri"
         * @param {object} data document.getElementById("ornekForm");
         */
        data    : this.isset(args.data, false),
        /**
         * AJAX isteği sonucunda dönen değerin türü.
         * 
         * @public
         * @param {string} type "text" veya "json"
         */
        type	: this.isset(args.type, false),
        events  : this.isset(args.events,false) ? {
            /**
             * AJAX isteği gönderilmeden önce çağırılacak metot
             * 
             * @public
             * @param {function} before Callback metodu
             */
            before	       : this.isset(args.events.before, function(){ console.log("onyx.options.events.before::true"); }),
            /**
             * AJAX isteği başladığında çağırılacak metot
             * 
             * @public
             * @param {function} start Callback metodu
             */
            start              : this.isset(args.events.start, function(){ console.log("onyx.options.events.start::true"); }),
            /**
             * AJAX isteği bittiğinde(başarılı veya başarısız) çağırılacak metot
             * 
             * @public
             * @param {function} end Callback metodu
             */
            end		       : this.isset(args.events.end, function(){ console.log("onyx.options.events.end::true"); }),
            /**
             * AJAX isteği başarısız sonuçlandığında çağırılacak metot
             * 
             * @example 
             * function(e){
             *      // Hata Kodu : e.statusCode;
             *      // Hata Mesajı : e.statusText;
             * }
             * 
             * @public
             * @param {function} error Callback metodu
             */
            error	       : this.isset(args.events.error, function(){ console.log("onyx.options.events.error::true"); }),
            /**
             * AJAX isteği başarılı sonuçlandığında çağırılacak metot
             * 
             * @example
             * function(e){
             *      // Cevap : e.response;
             * }
             * 
             * @public
             * @param {function} success Callback metodu
             */
            success	       : this.isset(args.events.success, function(){ console.log("onyx.options.events.success::true"); }),
            /**
             * AJAX isteğinin işlenmesi esnasında çağırılacak metot
             * ( İşlenen veri miktarı kullanılabilir )
             * 
             * @example
             * function(e){
             *      // Veri boyutu hesaplanabilirliği(true||false) : e.lengthComputable;
             *      // Toplam veri miktarı : e.total;
             *      // Yüklenen veri miktarı : e.loaded;
             * }
             * 
             * @public
             * @param {function} progress Callback metodu
             */
            progress	       : this.isset(args.events.progress, function(){ console.log("onyx.options.events.progress::true"); }),
            /**
             * AJAX isteği sonucunda dönen cevabın beklenmesi esnasında çağırılacak metot
             * 
             * @public
             * @param {function} loader Callback metodu
             */
            loader	       : this.isset(args.events.loader, function(){ console.log("onyx.options.events.loader::true"); })
        } : { }
    };
    
    /**
     * Hata kontrol mekanizması
     */
    try{
        /**
         * AJAX isteği başlamadan önce "before" metodu çağırılıyor
         */
        this.options.events.before();
        /**
         * AJAX isteği başladığında "start" metodu çağırılacak
         */
        this.xhr.onloadstart = this.options.events.start;
        /**
         * AJAX isteği bittiğinde(başarılı veya başarısız) "end" metodu çağırılacak
         */
        this.xhr.onloadend = this.options.events.end;
        /*
         * AJAX isteği başarısız olduğunda "error" metodu çağırılacak
        */
        this.xhr.onerrorevent = this.options.events.error;
        /*
         * AJAX isteği başarılı olduğunda "success" metodu çağırılacak
        */
        this.xhr.onsuccessevent = this.options.events.success;
        /*
         * AJAX isteği işleme alındığında "progress" metodu çağırılacak
        */
        this.xhr.upload.onprogress = this.options.events.progress;
        /*
         * AJAX isteği beklenirken "loader" metodu çağırılacak
        */
        this.xhr.onloaderevent = this.options.events.loader;
        /*
         * Eğer metot ve url ayarları yapıldıysa isteği aç
        */
        if(this.options.method && this.options.url){
            this.xhr.open(this.options.method,
                          this.options.method.toLowerCase() == 'post' ? this.options.url : this.options.url+"?"+this.options.data,
                          this.options.async);
        }
        /*
         * Eğer gönderilen data bir nesne(form) değil ise urlencode uygula, datayı url'den al
        */
        if(typeof this.options.data !== 'object' && typeof this.options.data !== 'undefined' && this.options.data){
                this.xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        }
        /*
         * AJAX isteği sonucunda dönen değerin türünü xhr nesnesi için tanımla
        */
        this.xhr.rtype = this.options.type ? this.options.type.toLowerCase() : "text";
        /*
         * AJAX isteği durum değiştirdiğinde olacaklar...
        */
        this.xhr.onreadystatechange = function(e){
            /**
             * İstek durum kodu
             * 
             * 4 : İstek Gönderildi
             * 3 : İstek işleniyor
             * 2 : İstek hazırlanıyor
             * 1 : İstek açıldı
             */
            var rs = e.target.readyState;
            /**
             * İstek gönderilen URL'den gelen cevap kodu
             * 
             * 200 : Sayfa bulundu
             * 404 : Sayfa bulunamadı
             */
            var st = e.target.status;
            /**
             * İstek gönderilen URL'den gelen cevap metni
             * 
             * 404 : NOT FOUND
             */
            var tx = e.target.statusText;
            /**
             * Eğer istek gönderildiyse ve sayfa bulunduysa {true} bloğunu çalıştır
             */
            if(rs == 4 && st == 200){
                /**
                 * XHR nesnesine(e.target) atanan success metodu çağırılıyor
                 * 
                 * @param {int} state İstek gönderilen URL'den gelen cevap kodu
                 * @param {int} statusCode İstek gönderilen URL'den gelen cevap kodu
                 * @param {string} statusText İstek gönderilen URL'den gelen cevap metni
                 * @param {string} response Cevap
                 */
                e.target.onsuccessevent({
                        state      : rs,
                        statusCode : st,
                        statusText : tx,
                        response   : e.target.rtype == 'json' ? JSON.parse(e.target.responseText) : e.target.responseText
                });
            /**
             * Eğer istek açılıyor(1), hazırlanıyor(2) ve işleniyorsa(3) aşağıdaki bloğu çalıştır
             */
            }else if( (rs == 3 || rs == 2 || rs == 1) && st == 200){
                /**
                 * XHR nesnesine atanan loader metodu çağırılıyor
                 */
                e.target.onloaderevent();
            /**
             * Eğer istek açılıyor ama sayfa bulunamıyorsa aşağıdaki bloğu çalıştır
             */
            }else if(rs == 4 && st != 200){
                /**
                 * XHR nesnesine atanan error metodu çağırılıyor
                 * 
                 * @param {int} statusCode İstek gönderilen URL'den gelen cevap kodu
                 * @param {string} statusText İstek gönderilen URL'den gelen cevap metni
                 */
                e.target.onerrorevent({
                        statusCode : st,
                        statusText : tx
                });
            }
        };
        /**
         * İsteği gönderiyor...
         */
        this.xhr.send( this.options.method.toLowerCase() == 'post' ? (typeof this.options.data === 'object' ? new FormData(this.options.data) : this.options.data) : null );
    }catch(err){
        /**
         * Hata kontrol mekanizması bir hata yakalarsa tarayıcıya log'luyor...
         */
        console.log(err);
    }
}
/**
 * Onyx'e tanımlı XMLHttpRequest nesnesini çağırmak için kullanılan metot.
 * 
 * @returns {onyx XMLHttpRequest} Geri döndürülen XMLHttpRequest nesnesi
 */
onyx.prototype.getObj = function(){
        return this.xhr;
};
/**
 * Değişken veya nesnelerin var olup olmadığını kontrol eden metot.
 * 
 * @param {variable} variable Kontrol edilecek değişken veya nesne
 * @param {variable} f Eğer değişken yok ise yerine atanacak değer
 * @returns {variable} Sonuç olarak geri döndürülecek değer
 */
onyx.prototype.isset = function(variable,f){
        return typeof variable !== 'undefined' ? variable : f;
};
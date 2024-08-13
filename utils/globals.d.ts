declare var isEditor: boolean;
declare var isMobile: boolean;
declare var isDesktop: boolean;
declare var css: any;
declare var params: any;
declare var cx: any;
declare var preload: (urls: string[] | string) => any;
declare var preloaded: (url: string) => boolean;
declare var navigate: (
  url: string,
  params?: {
    name?: string;
    where?: any;
    create?: any;
    update?: any;
    breads?: { label: string; url?: string }[];
  }
) => void;
declare var siteurl: (path: string) => string;
declare var baseurl: (path: string) => string;

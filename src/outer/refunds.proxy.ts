import * as $ from 'jquery';

type ResizeCallback = (n: number) => void;

class Refunds {

  private static windows = [];
  private static token: string = null;
  private static profile: object = null;
  private static translations: object = null;
  private static onResize: ResizeCallback = null;

  private windowId: string;

  constructor(windowId: string) {
    this.windowId = windowId;
  }

  static init(element: Element, src: string, width = '100%') {

    this.windows = this.windows
      .map(id => $(`[name=\'${id}\']`))
      .filter(ele => !!ele.length && !!(ele as any)[0].contentWindow)
      .map(ele => ele.attr('name'));

    const wid = this.guidGenerator();
    $('<iframe />')
      .width(width)
      .height(100)
      .attr({src: `${src}#${wid}`, name: wid})
      .css({border: 0})
      .appendTo(element);

    this.windows.push(wid);

    return new Refunds(wid);
  }

  static setToken(token: string) {
    this.token = token;
    this.dispatch({message: 'TOKEN_UPDATED', token});
  }

  static setOnResizeCallback(callback: ResizeCallback) {
    Refunds.onResize = callback;
  }

  static getToken() {
    return this.token;
  }

  static setProfile(profile: object) {
    this.profile = profile;
    this.dispatch({message: 'PROFILE_UPDATED', profile});
  }

  static getProfile() {
    return this.profile;
  }

  static setTranslations(translations: object) {
    this.translations = translations;
    this.dispatch({message: 'TRANSLATIONS_UPDATED', translations});
  }

  static getTranslations() {
    return this.translations;
  }

  static resizeWindow(id: string, height: number) {
    [id].map(i => $(`[name=\'${i}\']`))
      .filter(ele => !!ele.length && !!(ele as any)[0].contentWindow)
      .forEach(ele => $(ele).height(height));

    if (typeof Refunds.onResize === 'function') {
      Refunds.onResize(height);
    }
  }

  private static dispatch(msg) {
    this.windows
      .map(id => $(`[name=\'${id}\']`))
      .filter(ele => !!ele.length && !!(ele as any)[0].contentWindow)
      .forEach(ele => (ele as any)[0].contentWindow.postMessage(msg, '*'));
  }

  static dispatchTo(msg: object, id: string) {
    [id].map(i => $(`[name=\'${i}\']`))
      .filter(ele => !!ele.length && !!(ele as any)[0].contentWindow)
      .forEach(ele => (ele as any)[0].contentWindow.postMessage(msg, '*'));
  }

  private static guidGenerator() {
    const s4 = () => {
      // tslint:disable-next-line:no-bitwise
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
  }

}

(() => {
  (window as any).addEventListener('message', (evt) => {
    if (!!evt.data.id && !!evt.data.message) {
      switch (evt.data.message) {
        case 'GET_TOKEN':
          this.Refunds.dispatchTo({message: 'TOKEN_UPDATED', token: this.Refunds.getToken()}, evt.data.id);
          break;
        case 'GET_PROFILE':
          this.Refunds.dispatchTo({message: 'PROFILE_UPDATED', token: this.Refunds.getProfile()}, evt.data.id);
          break;
        case 'GET_TRANSLATIONS':
          this.Refunds.dispatchTo({message: 'TRANSLATIONS_UPDATED', token: this.Refunds.getTranslations()}, evt.data.id);
          break;
        case 'WINDOW_RESIZED':
          this.Refunds.resizeWindow(evt.data.id, evt.data.height);
          break;
      }
    }
  });
})();

export { Refunds };

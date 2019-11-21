import * as $ from 'jquery';

type ResizeCallback = (n: number) => void;

class Refunds {

  private static windows = [];
  private static token: string = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSbmZjbDZ5IiwiY2xpZW50SWQiOiIxMDAwMDAwMDgwIiwiY2xpZW50TmFtZSI6IkZJTVAgQ2xpZW50IiwicGF5bWVudE90cEVuYWJsZWQiOmZhbHNlLCJ1c2VyX25hbWUiOiJVU0VSbmZjbDZ5IiwidXNlck5hbWUiOiJGSU1QIFVTRVIiLCJ1c2VySWQiOiIxMDAwMDAwMDgyIiwidXNlckNvdW50cnlTZWdtZW50cyI6WyJHQlIiXSwiY2xpZW50X2lkIjoiZ3AyLXdlYiIsImF1dGhvcml0aWVzIjpbIkdlb1VzZXIiLCJSZXZpZXdSZWNlaXZhYmxlcyIsIkJvb2tSZWNlaXZhYmxlcyIsIlZpZXdSZWNlaXZhYmxlcyIsIkluaXRpYXRlUmVmdW5kIiwiQXBwcm92ZVJlZnVuZCIsIkdlb0FkbWluIiwiQXBwcm92ZU93bkl0ZW0iLCJWaWV3SW5jb21pbmdQYXltZW50IiwiTWFuYWdlUmVmdW5kUG9ydGFsIiwiVmlld1JlZnVuZCJdLCJpc1N5c3RlbUFkbWluIjp0cnVlLCJhdWQiOlsid3d3LmdwMi53ZXN0ZXJudW5pb24uY29tIl0sInVzZXJJbmR1c3RyeVNlZ21lbnRzIjpbIkZJIl0sInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE5MzE3NTg5MDEsImp0aSI6ImM4YjJlYzYwLTBkYjYtNGEzMy1iZmYxLTgwODY3MDg5Zjk5MSIsImVtYWlsIjoiWmFoaWQuR2F1aGFyQFdlc3Rlcm5Vbmlvbi5jb20iLCJpc1NlcnZpY2VBY2NvdW50IjpmYWxzZSwicHJlZmVycmVkTG9jYWxlIjoiZW5fR0IifQ.XvK-QUXK0M8ejMGsuw3QlK5aGF2wtRMwwQ60P4BOd5DLKvttFsaJcYiv9TsyqHxKJj7K3cdMpbnp2I-6f3nkOJGSyivOE4dA5YBACRUSfMsjZ5MXIGmepCO_XJmJXP230SfAWFtXFZCvvNuBzQQO37HJ1l2NdtVdhxmDaHw5yMlUfAg-Kl-TXHD5Lr7Q-BAbrvyLsIAp3wW-C_-QqbVa8Dmxf7FLzssiIGdxzcQdJfj4RJcZmXCPEfynhiXhAc7Ix6XA9I433qkfQ4B7GdB3U04gkERkiAwsOUBYzxfVPK3NkIjGrs6xWltWEn5YSX5JR52nPt2BGsxyGyWQYhFiUQ";
  private static profile: object = null;
  private static translations: object = null;
  private static onResize: ResizeCallback = null;
  private static apiUrl: string = null;

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
    this.token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVU0VSbmZjbDZ5IiwiY2xpZW50SWQiOiIxMDAwMDAwMDgwIiwiY2xpZW50TmFtZSI6IkZJTVAgQ2xpZW50IiwicGF5bWVudE90cEVuYWJsZWQiOmZhbHNlLCJ1c2VyX25hbWUiOiJVU0VSbmZjbDZ5IiwidXNlck5hbWUiOiJGSU1QIFVTRVIiLCJ1c2VySWQiOiIxMDAwMDAwMDgyIiwidXNlckNvdW50cnlTZWdtZW50cyI6WyJHQlIiXSwiY2xpZW50X2lkIjoiZ3AyLXdlYiIsImF1dGhvcml0aWVzIjpbIkdlb1VzZXIiLCJSZXZpZXdSZWNlaXZhYmxlcyIsIkJvb2tSZWNlaXZhYmxlcyIsIlZpZXdSZWNlaXZhYmxlcyIsIkluaXRpYXRlUmVmdW5kIiwiQXBwcm92ZVJlZnVuZCIsIkdlb0FkbWluIiwiQXBwcm92ZU93bkl0ZW0iLCJWaWV3SW5jb21pbmdQYXltZW50IiwiTWFuYWdlUmVmdW5kUG9ydGFsIiwiVmlld1JlZnVuZCJdLCJpc1N5c3RlbUFkbWluIjp0cnVlLCJhdWQiOlsid3d3LmdwMi53ZXN0ZXJudW5pb24uY29tIl0sInVzZXJJbmR1c3RyeVNlZ21lbnRzIjpbIkZJIl0sInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE5MzE3NTg5MDEsImp0aSI6ImM4YjJlYzYwLTBkYjYtNGEzMy1iZmYxLTgwODY3MDg5Zjk5MSIsImVtYWlsIjoiWmFoaWQuR2F1aGFyQFdlc3Rlcm5Vbmlvbi5jb20iLCJpc1NlcnZpY2VBY2NvdW50IjpmYWxzZSwicHJlZmVycmVkTG9jYWxlIjoiZW5fR0IifQ.XvK-QUXK0M8ejMGsuw3QlK5aGF2wtRMwwQ60P4BOd5DLKvttFsaJcYiv9TsyqHxKJj7K3cdMpbnp2I-6f3nkOJGSyivOE4dA5YBACRUSfMsjZ5MXIGmepCO_XJmJXP230SfAWFtXFZCvvNuBzQQO37HJ1l2NdtVdhxmDaHw5yMlUfAg-Kl-TXHD5Lr7Q-BAbrvyLsIAp3wW-C_-QqbVa8Dmxf7FLzssiIGdxzcQdJfj4RJcZmXCPEfynhiXhAc7Ix6XA9I433qkfQ4B7GdB3U04gkERkiAwsOUBYzxfVPK3NkIjGrs6xWltWEn5YSX5JR52nPt2BGsxyGyWQYhFiUQ";
    this.dispatch({message: 'TOKEN_UPDATED', token});
  }

  static setApiUri(uri: string) {
    this.apiUrl = uri;
    this.dispatch({message: 'API_URI_UPDATED', uri});
  }

  static getApiUri() {
    return this.apiUrl;
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
          this.Refunds.dispatchTo({message: 'PROFILE_UPDATED', profile: this.Refunds.getProfile()}, evt.data.id);
          break;
        case 'GET_TRANSLATIONS':
          this.Refunds.dispatchTo({message: 'TRANSLATIONS_UPDATED', translations: this.Refunds.getTranslations()}, evt.data.id);
          break;
        case 'GET_API_URI':
          this.Refunds.dispatchTo({message: 'API_URI_UPDATED', uri: this.Refunds.getApiUri()}, evt.data.id);
          break;
        case 'WINDOW_RESIZED':
          this.Refunds.resizeWindow(evt.data.id, evt.data.height);
          break;
      }
    }
  });
})();

export { Refunds };

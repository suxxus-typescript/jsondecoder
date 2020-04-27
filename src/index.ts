import * as D from 'json-decoder';

type UserAddress = {
  streetName: string;
  streetNum: number;
};

type User = {
  firstName: string;
  lastName: string;
  address: UserAddress;
  email?: string;
};

const userAddressDecoder = D.objectDecoder<UserAddress>({
  streetName: D.stringDecoder,
  streetNum: D.numberDecoder,
});

const userDecoder = D.objectDecoder<User>({
  firstName: D.stringDecoder,
  lastName: D.stringDecoder,
  address: userAddressDecoder,
  email: D.oneOfDecoders(D.stringDecoder, D.undefinedDecoder),
});

const jsonUser = {
  firstName: 'Juan',
  lastName: 'Perez',
  address: {
    streetName: 'San Paolo',
    streetNum: 1,
  },
  email: 'j.perez@xx.com',
};

const user = userDecoder.decode(jsonUser);

const toDecodedUser = (r: D.Result<User>) => {
  switch (r.type) {
    case 'OK':
      return r.value;
    case 'ERR':
      return r.message;
  }
};

console.log(user);
console.log('user type result: ', toDecodedUser(user));

// links
type LinksHref = {
  href: string;
};

type LinksSelf = {
  self: LinksHref;
};

type Links = {
  _links: LinksSelf;
};

const jsonLinks = {
  _links: {
    self: {
      href: '/orders/v1/486733',
    },
  },
};

const linksHrefDecoder = D.objectDecoder<LinksHref>({
  href: D.stringDecoder,
});

const linksSelfDecoder = D.objectDecoder<LinksSelf>({
  self: linksHrefDecoder,
});

const linksDecoder = D.objectDecoder<Links>({
  _links: linksSelfDecoder,
});

const toDecodeLinks = (r: D.Result<Links>) => {
  switch (r.type) {
    case 'OK':
      return r.value;
    case 'ERR':
      return r.message;
  }
};

console.log('links type result', toDecodeLinks(linksDecoder.decode(jsonLinks)));

// Orders

type Order = {
  order: string;
  _links: LinksSelf;
};

type Orders = {
  content: Order[];
};

const jsonOrders = {
  content: [
    {
      order: 'xxx',
      _links: {
        self: {
          href: 'orders/xxx/v1',
        },
      },
    },
  ],
};

const orderDecoder = D.objectDecoder<Order>({
  order: D.stringDecoder,
  _links: linksSelfDecoder,
});

const ordersDecoder = D.objectDecoder<Orders>({
  content: D.arrayDecoder(orderDecoder),
});

const toDecodeOrders = (r: D.Result<Orders>) => {
  switch (r.type) {
    case 'OK':
      return r.value;
    case 'ERR':
      return r.message;
  }
};

console.log(
  'orders type result:',
  JSON.stringify(toDecodeOrders(ordersDecoder.decode(jsonOrders))),
);

// -------------------------

type Exp = { exp: string };

type UrlParse = {
  pathNames: string[];
  queryParams: Exp;
};

const urlParse = {
  pathNames: ['xxx', '000'],
  queryParams: { exp: 'xxx' },
};

const pathNamesDecoder = D.arrayDecoder(D.stringDecoder);
const queryParamsDecoder = D.objectDecoder<Exp>({ exp: D.stringDecoder });

const urlParseDecoder = D.objectDecoder<UrlParse>({
  queryParams: D.objectDecoder<Exp>({ exp: D.stringDecoder }),
  pathNames: D.arrayDecoder(D.stringDecoder),
});

const toDecodeUrlParse = (r: D.Result<UrlParse>) => {
  switch (r.type) {
    case 'OK':
      return r.value;
    case 'ERR':
      return r.message;
  }
};

console.log(
  'pathNames type result',
  pathNamesDecoder.decode(urlParse.pathNames),
);

console.log(
  'queryParams type result',
  queryParamsDecoder.decode({ exp: '44444' }).map(({ exp }) => Number(exp)),
);

console.log('urlParseDecoder type result', urlParseDecoder.decode(urlParse));

console.log(
  'toDecodeUrlParse ',
  toDecodeUrlParse(urlParseDecoder.decode(urlParse)),
);

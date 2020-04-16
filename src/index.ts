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

import { Router, Request, Response } from 'express';
import { User } from '../entities/User';
import { validate } from 'class-validator';

const mapError = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    //이메일과 유저 이름이 이미 데이터베이스에 중복존재하는지 체크
    const emailUser = await User.findOneBy({ email });
    const usernameUser = await User.findOneBy({ username });

    //이미 중복존재하는 경우 errors  객체에 넣어줌
    if (emailUser) {
      errors.email = '이미 사용되고 있는 이메일 입니다.';
    }

    if (usernameUser) {
      errors.username = '이미 사용되고 있는 아이디 입니다.';
    }

    //에러가 있다면 return으로 에러를 res에 담아서 보냄
    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    //엔티티에 정해 놓은 조건으로 user데이터의 유효성 검사를 해준다
    errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json(mapError(errors));
    }

    //유저 정보를 user table에 저장
    await user.save();
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

const router = Router();
router.post('/register', register);

export default router;

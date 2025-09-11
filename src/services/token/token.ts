import moment from 'moment';
// import envConfig from '../../config/env';
import jwt from 'jsonwebtoken';
import { IAdminTokenPayload, IUserTokenPayload, TokenType } from './token.types';

class TokenService {
	static tokenPayloadFields = [
		'_id',
		'email',
		'phone',
		'firstName',
		'lastName',
		'dob',
		'kpDirectory',
		'profileImage',
		'roleNames',
		'status',
		'loginSource',
		'gender'
	];

	static generateToken(
		user: IUserTokenPayload | IAdminTokenPayload,
		expires: moment.Moment,
		type: TokenType,
		secret: string
	) {
		let payload;
		switch (type) {
			case TokenType.ACCESS:
				payload = {
					user,
					iat: moment().unix(),
					exp: expires.unix(),
					type
				};
				break;
			case TokenType.REFRESH:
				payload = {
					user: {
						id: user.id
					},
					iat: moment().unix(),
					exp: expires.unix(),
					type
				};
				break;
		}

		return jwt.sign(payload, secret);
	}

	static async generateAuthTokens(user: IUserTokenPayload | IAdminTokenPayload) {
		const accessTokenExpires = moment().add(60, 'minutes');
		const accessToken = this.generateToken(user, accessTokenExpires, TokenType.ACCESS, 'your_jwt_secret');

		const refreshTokenExpires = moment().add(7, 'days');
		const refreshToken = this.generateToken(user, refreshTokenExpires, TokenType.REFRESH, 'your_jwt_refresh_secret');

		return { accessToken, refreshToken };
	}
}

export default TokenService;

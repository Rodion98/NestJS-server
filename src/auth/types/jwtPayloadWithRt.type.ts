import { JwtPayload } from './jwtPayload.type.js';

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

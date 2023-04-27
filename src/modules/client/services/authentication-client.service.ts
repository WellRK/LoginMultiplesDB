import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { EnviromentVariablesEnum } from "../../shared/enums/enviroment.variables.enum";
import { ClientInterface } from "../interface/user.interface";
import { ClientRepository } from "../repositories/client.repository";
import { ClientStatusEnum } from "../enums/client-status.enum";
import { JwtPayloadClientInterface } from "src/modules/shared/interfaces/jwt-payload-client.interface";
import { AuthenticateClientRequestDto } from "../dtos/authenticate-client-request.dto";
import { AuthenticateClientResponseDto } from "../dtos/authenticate-client-response.dto";


@Injectable()
export class AuthenticationClientService {

    constructor(
        private readonly _clientRepository: ClientRepository,
        private readonly _configService: ConfigService,
        private readonly _jwtService: JwtService,
    ) { }

    private async validate(email: string, password: string): Promise<ClientInterface> {

        const client = await this._clientRepository.getByEmail(email);

        if (client) {
            // if (client.status === ClientStatusEnum.inactive)
            //     throw new UnauthorizedException('Authenticate error!');

            if (await bcrypt.compare(password, client.password))
                return client;
        }

        return null;
    }

    async authenticate(dto: AuthenticateClientRequestDto): Promise<AuthenticateClientResponseDto> {

        const client = await this.validate(dto.email, dto.password);

        if (!client)
            throw new NotFoundException('Invalid email and password!');

        const token = this._createToken(
            client._id,
            client.email,
        );

        return new AuthenticateClientResponseDto(
            client.email,
            token.accessToken,
        );
    }

    private _createToken(userId: string, email: string) {
        const client: JwtPayloadClientInterface = { userId, email };
        const expiresIn = this._configService.get(EnviromentVariablesEnum.JWT_EXPIRATION);
        const accessToken = this._jwtService.sign(client, { expiresIn });
        return { accessToken, expiresIn };
    }
}
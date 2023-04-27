// /* eslint-disable prettier/prettier */
// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { FuncaoEnum } from "src/modules/backoffice/enums/funcao-enum";


// @Injectable()
// export class FuncoesGuard implements CanActivate {

//     constructor(
//         private reflector: Reflector,
//     ) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {

//         const requiredFunctions = this.reflector.getAllAndOverride<FuncaoEnum[]>('roles', [
//             context.getHandler(),
//             context.getClass(),
//         ]);

//         if (!requiredFunctions)
//             return true;

//         const { user } = context.switchToHttp().getRequest();``
//         return user.roles.some(a => requiredFunctions.includes(a));
//     }
// }
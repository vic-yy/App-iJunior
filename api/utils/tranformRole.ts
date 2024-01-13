import Role from "./Role";

function transformRole (role:string){
	const lcRole = role.toLowerCase();
	if (lcRole == 'adm' || lcRole == 'administrador' || lcRole == 'admin' || lcRole == 'administrator') {
		return Role.ADM;
	} else if (lcRole == 'membro' || lcRole == 'member') {
		return Role.MEMBRO;
	} else if (lcRole == 'trainee') {
		return Role.TRAINEE;
	} else {
		return 'none'
	}
}

export { transformRole };
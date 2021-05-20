export function loginWithKakao (r) {
    window.Kakao.Auth.login({
        scope: 'account_email',
        success: function (authObj) {
            window.KaKao.API.request({
                url: '/v2/user/me',
                success: res => {
                    const token = authObj.access_token;
                    console.log(token);
                }
            });
        },
        fail: function (err) {
            alert("로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.");
        },
    })
}

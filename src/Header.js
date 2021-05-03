import loginImage from './img/kakaoLogin.png';
import styles from './css/Header.module.css';


const loginWithKakao = function(r) {
    window.Kakao.Auth.login({
        scope: 'account_email',
        success: function(authObj) {
            window.KaKao.API.request({
                url: '/v2/user/me',
                success: res =>{
                    const token = authObj.access_token;
                }
            });
        },
        fail: function(err) {
            alert("로그인에 실패했습니다. 아이디나 비밀번호를 확인해주세요.");
        },
    })
}

export function Header(props) {
    return (
      <>
        <div className={styles.header}>
            <span className={styles.headerTitle}>TODO</span>
            <img className={styles.kakaoBtn} src={loginImage} onClick={loginWithKakao}/>
        </div>
      </>
    );
}
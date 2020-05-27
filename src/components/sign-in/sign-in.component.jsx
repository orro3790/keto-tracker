import React from 'react';
import CustomButton from '../custom-button/custom-button.component';
import { ReactComponent as Logo } from '../../assets/G.svg';
import { signInWithGoogle } from '../../firebase/firebase.utils';

import './sign-in.styles.scss';

const SignIn = () => {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     await auth.signInWithEmailAndPassword(email, password);
  //     // this.setState({ email: '', password: '' });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <CustomButton type='button' onClick={signInWithGoogle} className='google'>
      <div className='with-icon-c'>
        <Logo className='g' />
        <div>SIGN IN WITH GOOGLE</div>
      </div>
    </CustomButton>
  );
};

export default SignIn;

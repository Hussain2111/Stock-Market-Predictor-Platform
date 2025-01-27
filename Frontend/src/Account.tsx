import React, { useState, FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const SignInPopup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleSignInSignUp = () => {
    setIsSignUp(!isSignUp);
    // Reset form when switching modes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUp) {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      console.log('Sign Up', { email, password });
    } else {
      console.log('Sign In', { email, password });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </DialogTitle>
          <DialogDescription>
            {isSignUp
              ? 'Create a new account to get started.'
              : 'Sign in to your existing account.'}
          </DialogDescription>
        </DialogHeader>
        
      </DialogContent>
    </Dialog>
  );
};

export default SignInPopup;
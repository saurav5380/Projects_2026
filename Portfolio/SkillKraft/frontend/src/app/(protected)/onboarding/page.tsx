// check useCurrentUser from useAuth hook 
// if onboardingDone then display dashboard
// else display <onboardingWizard>

import {useEffect, useState} from 'react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { OnboardingWiz } from '@/components/onboarding/OnboardingWizard';

const OnboardingPage = () => {
    const router = useRouter();
    const {useCurrentUser} = useAuth();
    const [loading, isLoading] = useState(true);
    useEffect(() => {
        if (useCurrentUser?.onboardingDone){
            router.replace("/dashboard")
        }
    }, [useCurrentUser, router])

    if (loading || useCurrentUser?.onboardingDone){
        return <Spinner/>
    }
    
    isLoading(false)
    
    return <OnboardingWiz/>

}   

export default OnboardingPage;
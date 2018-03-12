#include<bits/stdc++.h>
#define pb push_back
#define ll long long
#define d double
using namespace std;
int main()
{
    ll t,i,a;
    cin>>t;
    while(t--)
    {
        ll c=0,index=0;
        vector<ll>v;
        ll n;
        cin>>n;
        for(i=0;i<n;i++)
        {
            cin>>a;
            v.pb(a);
        }
        ll z=1;
        for(i=1;i<n;i++)
        {
            if(v[i]!=v[0])
            {
                index=i;
                break;
            }
            else
            {
                z++;
            }
        }
        for(i=index;i<n;i++)
        {
            if(v[i]!=v[0] || v[i]!=v[i-1])
            {
                c++;
            }
        }
            if(z==n)
            {
                c=0;
                cout<<c<<endl;
            }
           else
           {
               cout<<c<<endl;
           }
    }
    return 0;
}

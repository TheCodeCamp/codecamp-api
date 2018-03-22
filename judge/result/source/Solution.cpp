<<<<<<< HEAD
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
=======
#include <iostream>
using namespace std;
 
int isAnyonebetter(int *a, int *b) {
  int credit_a = 0, credit_b = 0;
  int same_count = 0;
  for (int e = 0; e < 3; e++) {
    if (a[e] > b[e]) {
      credit_a++;
    }
    if (a[e] < b[e]) {
      credit_b++;
    }
    if (a[e] == b[e]) same_count++;
  }
  if (same_count != 3 && (credit_a == 0 || credit_b == 0))
    return 1;
  else
    return 0;
}
 
int main() {
  int t;
  cin >> t;
 
  while (t--) {
    int score_set[3][3] = {{0, 0, 0}, {0, 0, 0}, {0, 0, 0}};
    for (int t = 0; t < 3; t++)
      for (int k = 0; k < 3; k++) {
        int p;
        cin >> p;
        score_set[t][k] = p;
      }
    int better_count = 0;
    better_count += isAnyonebetter(score_set[0], score_set[1]);
    better_count += isAnyonebetter(score_set[0], score_set[2]);
    better_count += isAnyonebetter(score_set[1], score_set[2]);
 
    if (better_count == 3)
      cout << "yes" << endl;
    else
      cout << "no" << endl;
  }
  return 0;
} 
>>>>>>> 6b9a84523259144e34994839aeeb1470ef83ebe7

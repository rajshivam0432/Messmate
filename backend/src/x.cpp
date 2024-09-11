#include <bits/stdc++.h>
using namespace std;

int main()
{
    int t;
    cin >> t;
    while (t--)
    {
        int n, q;
        cin >> n >> q;
        string a, b;
        cin >> a >> b;
        while (q--)
        {
            int l, r;
            cin >> l >> r;
            l--;
            r--;
            map<char, int> mp;
            for (int i = l; i <= r; i++)
            {
                mp[a[i]]++;
            }
            int cnt = 0;
            for (int i = l; i <= r; i++)
            {
                if (mp.find(b[i]) != mp.end() && mp[b[i]] > 0)
                {
                    mp[b[i]]--;
                }
                else
                {
                    cnt++;
                }
            }
        }
    }
}
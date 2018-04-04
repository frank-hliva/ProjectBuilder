using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProjectBuilder
{
    public class KeyValueItem
    {
        public string Key { get; set; }
        public string Value { get; set; }

        public KeyValueItem(string key = "", string value = "")
        {
            Key = key;
            Value = value;
        }

        public static KeyValueItem From(KeyValuePair<string, string> keyValuePair)
        {
            return new KeyValueItem(keyValuePair.Key, keyValuePair.Value);
        }
    }
}

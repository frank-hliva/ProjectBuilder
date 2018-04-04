using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.IO;
using BuilderLib;
using System.ComponentModel;
using System.Threading;
using System.Windows.Threading;

namespace ProjectBuilder
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private BindingList<KeyValueItem> values = null;
        private readonly string templatePath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, @"ProjectTemplate");
        private readonly string settingsPath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, @"settings.json");

        public MainWindow()
        {
            InitializeComponent();
            LoadSettings(settingsPath);
        }

        private void LoadSettings(string path)
        {
            var settings = JsonConvert.DeserializeObject<BuilderOptions>(File.ReadAllText(path));
            pathTextBox.Text = settings.targetPath;
            var list = settings.values.Select(v => KeyValueItem.From(v)).ToList();
            values = new BindingList<KeyValueItem>(list);
            valuesDataGrid.ItemsSource = values;
        }

        private void SaveSettings(string path)
        {
            var options = GetBuilderOptions();
            var json = JsonConvert.SerializeObject(options);
            File.WriteAllText(path, json);
        }

        private void SelectPathButton_Click(object sender, RoutedEventArgs e)
        {
            using (var dialog = new System.Windows.Forms.FolderBrowserDialog())
            {
                dialog.SelectedPath = pathTextBox.Text;
                if (dialog.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    pathTextBox.Text = dialog.SelectedPath;
                }
            }
        }

        private void AddButton_Click(object sender, RoutedEventArgs e)
        {
            values.Add(new KeyValueItem());
        }

        private void RemoveButton_Click(object sender, RoutedEventArgs e)
        {
            var selectedItem = valuesDataGrid.SelectedItem as KeyValueItem;
            if (selectedItem != null)
            {
                values.Remove(selectedItem);
            }
        }

        public BuilderOptions GetBuilderOptions(string templatePath = "")
        {
            var values = this.values
                .Select(kv => new Tuple<string, string>(kv.Key, kv.Value));
            return new BuilderOptions(templatePath, pathTextBox.Text, new Microsoft.FSharp.Collections.FSharpMap<string, string>(values));
        }

        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            this.SaveSettings(settingsPath);
        }

        private void CreateProjectButton_Click(object sender, RoutedEventArgs e)
        {
            var button = sender as Button;
            var content = button.Content;
            button.IsEnabled = false;
            button.Content = "Saving...";
            this.SaveSettings(settingsPath);
            var options = GetBuilderOptions(templatePath);
            new Thread(() =>
            {
                BuilderLib.ProjectBuilder.build(options);
                button.Dispatcher.Invoke((Action)delegate ()
                {
                    button.IsEnabled = true;
                    button.Content = content;
                });
            }).Start();
        }
    }
}

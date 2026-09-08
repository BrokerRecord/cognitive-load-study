import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import json
import os
from pathlib import Path

def load_csv_data(csv_path=None):
    """Load the aggregated CSV data"""
    if csv_path is None:
        script_dir = Path(__file__).parent.absolute()
        csv_path = script_dir.parent / 'data' / 'all_participants.csv'
    
    if not os.path.exists(csv_path):
        print(f"❌ CSV file not found at {csv_path}")
        print(f"Script location: {script_dir}")
        print(f"Looking for: {script_dir.parent / 'data' / 'all_participants.csv'}")
        
        # Try alternative paths
        alt_paths = [
            'data/all_participants.csv',
            '../data/all_participants.csv',
            './data/all_participants.csv',
        ]
        
        for alt in alt_paths:
            if os.path.exists(alt):
                print(f"✅ Found data at: {alt}")
                csv_path = alt
                break
        else:
            print("❌ Data file not found in any location")
            return None
    
    df = pd.read_csv(csv_path)
    print(f"✅ Loaded data for {len(df)} participants")
    return df

def load_json_data(json_path='data/all_participants.json'):
    """Load the full JSON data"""
    if not os.path.exists(json_path):
        print(f"❌ JSON file not found at {json_path}")
        return None
    
    with open(json_path, 'r') as f:
        data = json.load(f)
    print(f"✅ Loaded JSON data for {len(data)} participants")
    return data

def calculate_descriptive_stats(df):
    """Calculate descriptive statistics for all measures"""
    print("\n" + "="*50)
    print("DESCRIPTIVE STATISTICS")
    print("="*50)
    
    # Demographic summary
    print("\n📊 DEMOGRAPHICS:")
    print(f"Total Participants: {len(df)}")
    print(f"Average Age: {df['age'].mean():.1f} years")
    print(f"Age Range: {df['age'].min()} - {df['age'].max()} years")
    print("\nGender Distribution:")
    print(df['gender'].value_counts())
    print("\nEducation Distribution:")
    print(df['education'].value_counts())
    print(f"Average Tech Experience: {df['tech_experience'].mean():.1f}/10")
    
    # Interface A
    print("\n📱 INTERFACE A:")
    print(f"Average Completion Time: {df['interface_a_avg_time'].mean():.2f} seconds")
    print(f"Average Errors: {df['interface_a_errors'].mean():.2f}")
    print(f"Success Rate: {df['interface_a_success_rate'].mean():.1f}%")
    print("\nNASA-TLX Scores (Interface A):")
    print(f"  Mental Demand: {df['interface_a_mental_demand'].mean():.1f}")
    print(f"  Physical Demand: {df['interface_a_physical_demand'].mean():.1f}")
    print(f"  Temporal Demand: {df['interface_a_temporal_demand'].mean():.1f}")
    print(f"  Performance: {df['interface_a_performance'].mean():.1f}")
    print(f"  Effort: {df['interface_a_effort'].mean():.1f}")
    print(f"  Frustration: {df['interface_a_frustration'].mean():.1f}")
    
    # Interface B
    print("\n💻 INTERFACE B:")
    print(f"Average Completion Time: {df['interface_b_avg_time'].mean():.2f} seconds")
    print(f"Average Errors: {df['interface_b_errors'].mean():.2f}")
    print(f"Success Rate: {df['interface_b_success_rate'].mean():.1f}%")
    print("\nNASA-TLX Scores (Interface B):")
    print(f"  Mental Demand: {df['interface_b_mental_demand'].mean():.1f}")
    print(f"  Physical Demand: {df['interface_b_physical_demand'].mean():.1f}")
    print(f"  Temporal Demand: {df['interface_b_temporal_demand'].mean():.1f}")
    print(f"  Performance: {df['interface_b_performance'].mean():.1f}")
    print(f"  Effort: {df['interface_b_effort'].mean():.1f}")
    print(f"  Frustration: {df['interface_b_frustration'].mean():.1f}")
    
    # SUS
    print(f"\n📝 Average SUS Score: {df['sus_score'].mean():.1f}")
    print(f"SUS Range: {df['sus_score'].min():.1f} - {df['sus_score'].max():.1f}")
    
    return df

def perform_statistical_tests(df):
    """Perform statistical tests comparing Interface A and B"""
    print("\n" + "="*50)
    print("STATISTICAL TESTS (Interface A vs B)")
    print("="*50)
    
    # Paired t-tests
    metrics = [
        ('Completion Time', 'interface_a_avg_time', 'interface_b_avg_time'),
        ('Errors', 'interface_a_errors', 'interface_b_errors'),
        ('Success Rate', 'interface_a_success_rate', 'interface_b_success_rate'),
        ('Mental Demand', 'interface_a_mental_demand', 'interface_b_mental_demand'),
        ('Physical Demand', 'interface_a_physical_demand', 'interface_b_physical_demand'),
        ('Temporal Demand', 'interface_a_temporal_demand', 'interface_b_temporal_demand'),
        ('Performance', 'interface_a_performance', 'interface_b_performance'),
        ('Effort', 'interface_a_effort', 'interface_b_effort'),
        ('Frustration', 'interface_a_frustration', 'interface_b_frustration'),
    ]
    
    results = {}
    for name, col_a, col_b in metrics:
        t_stat, p_value = stats.ttest_rel(df[col_a], df[col_b])
        effect_size = calculate_cohens_d(df[col_a], df[col_b])
        results[name] = {
            't_stat': t_stat,
            'p_value': p_value,
            'effect_size': effect_size,
            'significant': p_value < 0.05
        }
        
        print(f"\n{name}:")
        print(f"  Interface A Mean: {df[col_a].mean():.2f}")
        print(f"  Interface B Mean: {df[col_b].mean():.2f}")
        print(f"  t-statistic: {t_stat:.3f}")
        print(f"  p-value: {p_value:.4f}")
        print(f"  Effect size (Cohen's d): {effect_size:.3f}")
        print(f"  Significant: {'✅ YES' if p_value < 0.05 else '❌ NO'}")
    
    return results

def calculate_cohens_d(a, b):
    """Calculate Cohen's d effect size"""
    mean_diff = a.mean() - b.mean()
    pooled_std = np.sqrt((a.std(ddof=1)**2 + b.std(ddof=1)**2) / 2)
    return mean_diff / pooled_std if pooled_std != 0 else 0

def create_visualizations(df):
    """Create comprehensive visualizations"""
    print("\n" + "="*50)
    print("CREATING VISUALIZATIONS")
    print("="*50)
    
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    fig.suptitle('Cognitive Load Study Results', fontsize=16, fontweight='bold')
    
    # 1. Completion Times Comparison
    ax = axes[0, 0]
    data = [df['interface_a_avg_time'], df['interface_b_avg_time']]
    bp = ax.boxplot(data, patch_artist=True)
    bp['boxes'][0].set_facecolor('lightblue')
    bp['boxes'][1].set_facecolor('lightcoral')
    ax.set_xticklabels(['Interface A', 'Interface B'])
    ax.set_ylabel('Time (seconds)')
    ax.set_title('Task Completion Times')
    ax.grid(True, alpha=0.3)
    
    # 2. Error Rates
    ax = axes[0, 1]
    data = [df['interface_a_errors'], df['interface_b_errors']]
    bp = ax.boxplot(data, patch_artist=True)
    bp['boxes'][0].set_facecolor('lightblue')
    bp['boxes'][1].set_facecolor('lightcoral')
    ax.set_xticklabels(['Interface A', 'Interface B'])
    ax.set_ylabel('Number of Errors')
    ax.set_title('Error Rates')
    ax.grid(True, alpha=0.3)
    
    # 3. SUS Distribution
    ax = axes[0, 2]
    ax.hist(df['sus_score'], bins=10, edgecolor='black', alpha=0.7, color='skyblue')
    ax.axvline(df['sus_score'].mean(), color='red', linestyle='--', 
               label=f'Mean: {df["sus_score"].mean():.1f}')
    ax.set_xlabel('SUS Score')
    ax.set_ylabel('Frequency')
    ax.set_title('SUS Distribution')
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    # 4. NASA-TLX Comparison
    ax = axes[1, 0]
    tlx_dims = ['Mental Demand', 'Physical Demand', 'Temporal Demand', 
                'Performance', 'Effort', 'Frustration']
    a_scores = [
        df['interface_a_mental_demand'].mean(),
        df['interface_a_physical_demand'].mean(),
        df['interface_a_temporal_demand'].mean(),
        df['interface_a_performance'].mean(),
        df['interface_a_effort'].mean(),
        df['interface_a_frustration'].mean()
    ]
    b_scores = [
        df['interface_b_mental_demand'].mean(),
        df['interface_b_physical_demand'].mean(),
        df['interface_b_temporal_demand'].mean(),
        df['interface_b_performance'].mean(),
        df['interface_b_effort'].mean(),
        df['interface_b_frustration'].mean()
    ]
    
    x = np.arange(len(tlx_dims))
    width = 0.35
    ax.bar(x - width/2, a_scores, width, label='Interface A', color='lightblue')
    ax.bar(x + width/2, b_scores, width, label='Interface B', color='lightcoral')
    ax.set_xlabel('Dimensions')
    ax.set_ylabel('Mean Rating')
    ax.set_title('NASA-TLX Comparison')
    ax.set_xticks(x)
    ax.set_xticklabels(tlx_dims, rotation=45, ha='right')
    ax.legend()
    ax.grid(True, alpha=0.3, axis='y')
    
    # 5. Correlation Heatmap
    ax = axes[1, 1]
    corr_vars = ['interface_a_avg_time', 'interface_a_errors', 
                 'interface_b_avg_time', 'interface_b_errors', 'sus_score']
    corr_data = df[corr_vars]
    corr_matrix = corr_data.corr()
    sns.heatmap(corr_matrix, annot=True, fmt='.2f', cmap='coolwarm', 
                center=0, square=True, ax=ax)
    ax.set_title('Correlation Matrix')
    
    # 6. Individual Performance
    ax = axes[1, 2]
    for i in range(len(df)):
        ax.plot([1, 2], [df.iloc[i]['interface_a_avg_time'], 
                        df.iloc[i]['interface_b_avg_time']], 
                'o-', alpha=0.3, color='gray')
    ax.plot([1, 2], [df['interface_a_avg_time'].mean(), 
                    df['interface_b_avg_time'].mean()], 
            'o-', linewidth=2, color='red', label='Mean')
    ax.set_xticks([1, 2])
    ax.set_xticklabels(['Interface A', 'Interface B'])
    ax.set_ylabel('Completion Time (seconds)')
    ax.set_title('Individual Performance Trends')
    ax.legend()
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    # Save results
    script_dir = Path(__file__).parent.absolute()
    analysis_dir = script_dir.parent
    save_path = analysis_dir / 'study_results.png'
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"✅ Visualizations saved to '{save_path}'")
    plt.show()

def generate_report(df, test_results):
    """Generate a summary report"""
    print("\n" + "="*50)
    print("FINAL REPORT")
    print("="*50)
    
    # Significant findings
    significant_findings = [name for name, results in test_results.items() if results['significant']]
    
    print("\n🔍 KEY FINDINGS:")
    print(f"• Significant differences found in: {', '.join(significant_findings)}")
    
    # Interpretation
    print("\n📈 INTERPRETATION:")
    if 'Completion Time' in significant_findings:
        mean_diff = df['interface_b_avg_time'].mean() - df['interface_a_avg_time'].mean()
        print(f"• Interface B took {mean_diff:.2f} seconds longer to complete tasks")
        print("  → Suggests higher cognitive load with complex interface")
    
    if 'Errors' in significant_findings:
        error_diff = df['interface_b_errors'].mean() - df['interface_a_errors'].mean()
        print(f"• Interface B had {error_diff:.2f} more errors on average")
        print("  → Suggests increased cognitive load leads to more mistakes")
    
    if 'Mental Demand' in significant_findings:
        demand_diff = df['interface_b_mental_demand'].mean() - df['interface_a_mental_demand'].mean()
        print(f"• Interface B had {demand_diff:.1f} higher mental demand rating")
        print("  → Participants perceived complex interface as more demanding")
    
    # SUS Interpretation
    sus_score = df['sus_score'].mean()
    if sus_score >= 80:
        sus_grade = "A (Excellent)"
    elif sus_score >= 70:
        sus_grade = "B (Good)"
    elif sus_score >= 60:
        sus_grade = "C (Okay)"
    elif sus_score >= 50:
        sus_grade = "D (Poor)"
    else:
        sus_grade = "F (Unacceptable)"
    
    print(f"\n📊 System Usability Score: {sus_score:.1f} ({sus_grade})")
    
    print("\n" + "="*50)

def main():
    """Main analysis function"""
    print("🔬 Cognitive Load Study - Data Analysis")
    print("="*50)
    
    # Load data
    df = load_csv_data()
    if df is None:
        print("❌ No data found. Please collect data first.")
        return
    
    # Analyze
    df = calculate_descriptive_stats(df)
    test_results = perform_statistical_tests(df)
    create_visualizations(df)
    generate_report(df, test_results)
    
    # Save summary
    summary = {
        'total_participants': len(df),
        'summary_stats': {
            'age_mean': df['age'].mean(),
            'tech_experience_mean': df['tech_experience'].mean(),
            'sus_mean': df['sus_score'].mean(),
            'interface_a_time_mean': df['interface_a_avg_time'].mean(),
            'interface_b_time_mean': df['interface_b_avg_time'].mean(),
            'interface_a_errors_mean': df['interface_a_errors'].mean(),
            'interface_b_errors_mean': df['interface_b_errors'].mean(),
        }
    }
    
    with open('analysis_summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    print("\n✅ Summary saved to 'analysis_summary.json'")

if __name__ == "__main__":
    main()
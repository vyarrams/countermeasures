

export class ProjectPDF {
  getProjectPDFTemplate(project: any): any {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <style>
    .doc-wrapper{
        border: 1px solid #000;
        padding: 10px;
    }
    table{
        border-collapse: collapse;
        width: 100%;
      }
      th, td {
        padding: 5px 5px;
        text-align: left;
      }
    </style>
    </head>
    <body>
    <div class="doc-wrapper">
    <table>
    <tbody>
      <tr>
      <th>
      Added by
      </th>
      <td>
      ${project.user[0]?.first_name} ${project.user[0]?.last_name}
      </td>
      </tr>
      <tr>
      <th>
      Added on
      </th>
      <td>
      ${project.createdAt ? new Date(project.createdAt).toDateString() : ''}
      </td>
      </tr>
      <tr>
      <th>
      Roadway Name
      </th>
      <td>
      ${project.roadway_name}
      </td>
      </tr>

      <tr>
      <th>
      Total Project Cost
      </th>
      <td>
      ${project.total_project_cost}
      </td>
      </tr>

      <tr>
      <th>
      Total Savings in Crash Reduction
      </th>
      <td>
      ${project.total_savings_in_crash_reduction}
      </td>
      </tr>

      <tr>
      <th>
      Benefit Cost Ratio
      </th>
      <td>
      ${project.benefit_cost_ratio}
      </td>
      </tr>

      <tr>
      <th>
      Notes
      </th>
      <td>
      ${project.notes}
      </td>
      </tr>

      <tr>
      <th>
      From
      </th>
      <td>
      ${project.from}
      </td>
      </tr>
      <tr>
      <th>
      To
      </th>
      <td>
      ${project.to}
      </td>
      </tr>
      <tr>
      <th>
      City
      </th>
      <td>
      ${project.city}
      </td>
      </tr>
      <tr>
      <th>
      Parish
      </th>
      <td>
      ${project.parish}
      </td>
      </tr>
      <tr>
      <th>
      Control Section
      </th>
      <td>
      ${project.control_section}
      </td>
      </tr>
      <tr>
      <th>
      Begin Mile
      </th>
      <td>
      ${project.begin_mile}
      </td>
      </tr>
      <tr>
      <th>
      End Mile
      </th>
      <td>
      ${project.end_mile}
      </td>
      </tr>
      <tr>
      <th>
      Description
      </th>
      <td>
      ${project.description}
      </td>
      </tr>
      <tr>
      <th>
      Location
      </th>
      <td>
      ${project.location}
      </td>
      </tr>
      <tr>
      <th>
      Coords
      </th>
      <td>
      Lat: ${project.coords.lat}, Lng: ${project.coords.lng}
      </td>
      </tr>
      <tr>
      <th>
      Roadway Area Type
      </th>
      <td>
        ${project.roadway_area_type.map((type: any) => {
      return `<p>${type.name}</p>`;
    }).join('')}
      </td>
      </tr>
      <tr>
      <th>
      Roadway Classifications
      </th>
      <td>
        ${project.roadway_classification.map((type: any) => {
      return `<p>${type.name}</p>`;
    }).join('')}
      </td>
      </tr>

      <tr>
      <th>
      Focus Area
      </th>
      <td>
        ${project.focus_area.map((type: any) => {
      return `<p>${type.name}</p>`;
    }).join('')}
      </td>
      </tr>

      <tr>
      <th>
      Average Annual Day Traffic Vehicular Volume
      </th>
      <td>
        ${project.aadtvv.map((type: any) => {
      return `<p>${type.name}</p>`;
    }).join('')}
      </td>
      </tr>

      <tr>
      <th>
        Problems to be addressed
      </th>
      <td>
        ${project.problems_to_be_addressed.map((type: any) => {
      return `<p>${type.name}</p>`;
    }).join('')}
      </td>
      </tr>

      <tr>
      <th>
        Crash types being targeted
      </th>
      <td>
        ${project.target_crash_type.map((type: any) => {
      return `<p>${type.name}</p>`;
    }).join('')}
      </td>
      </tr>

      <tr>
      <th>
        Countermeasures
        </th>
        <td>
        ${project.countermeasures.map((type: any) => {
      return `<p>${type.countermeasure}, ${type?.total_implementation_cost}, ${type?.comments}</p>`;
    }).join('')}
      </td>
      </tr>

    </tbody>
    </table>
    </div>
    </body>
    </html>
        `;
  }
}